'use strict';

function buildGoodsCartList(barcodeList) {
    let barcodeListWithQuantity = resolveBarcode(barcodeList);
    return countGoods(barcodeListWithQuantity);
}

function buildPurchasedGoods(purchasedGoods) {
    let productList = loadAllItems();
    return purchasedGoods.map(item => {
        let searchItem = productList.find(product => product.barcode === item.barcode);
        return Object.assign({}, searchItem, { quantity: item.quantity });
    })
}

function calculateGoodsPrice(purchasedGoodsWithDetail) {
    let promotionList = loadPromotions();
    let goodListWithsubTotal = calculateSubTotalPrice(purchasedGoodsWithDetail);
    return calculatePromotionSubTotalPrice(goodListWithsubTotal, promotionList);

}

function buildPrintReceipt(purchasedGoodsWithPrice) {
    return { buyItemList: purchasedGoodsWithPrice, total: calculateReceiptTotalPrice(purchasedGoodsWithPrice), saving: calculateReceiptSaving(purchasedGoodsWithPrice) };
}

function formatReceipt(priceReceipt) {
    let receipt = '';
    receipt += `***<store earning no money>Receipt ***\n`;
    priceReceipt.buyItemList.forEach(item => {
        let subTotal;
        if (item.promotionSubTotal != null) {
            subTotal = item.promotionSubTotal;
        } else {
            subTotal = item.subTotal;
        }
        receipt += 'Name: ' + item.name + ', Quantity: ' + item.quantity + ' ' + item.unit + ', Unit price: ' + item.price.toFixed(2) + ' (yuan), Subtotal: ' + subTotal.toFixed(2) + ' (yuan)\n';
    })
    receipt += '----------------------\n';
    receipt += 'Total: ' + priceReceipt.total.toFixed(2) + ' (yuan)\n';
    receipt += 'Saving: ' + priceReceipt.saving.toFixed(2) + ' (yuan)\n';
    receipt += '**********************';
    return receipt;
}


function resolveBarcode(barcodeList) {
    return barcodeList.map(barcode =>
        (barcode.includes('-')) ? { barcode: barcode.split('-')[0], quantity: parseFloat(barcode.split('-')[1]) } : { barcode, quantity: 1 }
    );
}


function countGoods(purchasedGoods) {
    let result = [];
    purchasedGoods.forEach(itemfirstloop => {
        if (!result.find(element => element.barcode === itemfirstloop.barcode)) {
            let quan = 0;
            purchasedGoods.filter(item => item.barcode === itemfirstloop.barcode).forEach(itemsecondloop => {
                quan += itemsecondloop.quantity;
            });
            result.push({ barcode: itemfirstloop.barcode, quantity: quan });
        }
    });
    return result;
}

function calculateSubTotalPrice(purchasedGoodsWithDetail) {
    return purchasedGoodsWithDetail.map(item => Object.assign({}, item, { subTotal: item.price * item.quantity }));
}

function calculatePromotionSubTotalPrice(purchasedGoodsWithDetail, promotionList) {
    let buyTwoGetOneFreeList = promotionList.find(promotion => promotion.type === 'BUY_TWO_GET_ONE_FREE').barcodes;
    return purchasedGoodsWithDetail.map(item => {
        if (buyTwoGetOneFreeList.includes(item.barcode) && item.quantity >= 3) {
            return Object.assign({}, item, { promotionSubTotal: ((item.quantity - (item.quantity % 3)) / 3 * 2 * item.price) + ((item.quantity % 3) * item.price) });
        } else {
            return item;
        }
    });
}

function calculateReceiptTotalPrice(purchasedGoodsWithPrice) {
    let total = 0;
    purchasedGoodsWithPrice.forEach(item => {
        if (item.promotionSubTotal != null) {
            total += item.promotionSubTotal;
        } else {
            total += item.subTotal;
        }
    });
    return total;
}

function calculateReceiptSaving(purchasedGoodsWithPrice) {
    let saving = 0;
    purchasedGoodsWithPrice.forEach(item => {
        if (item.promotionSubTotal != null) {
            saving += (item.subTotal - item.promotionSubTotal);
        }
    });
    return saving;
}

function formatGoodInfo(priceReceipt) {
    let receipt = '';
    priceReceipt.buyItemList.forEach(item => {
        let subTotal;
        if (item.promotionSubTotal != null) {
            subTotal = item.promotionSubTotal;
        } else {
            subTotal = item.subTotal;
        }
        receipt += 'Name: ' + item.name + ', Quantity: ' + item.quantity + ' ' + item.unit + ', Unit price: ' + item.price.toFixed(2) + ' (yuan), Subtotal: ' + subTotal.toFixed(2) + ' (yuan)\n';
    })
    return receipt;
}

function printFullReceipt(priceReceipt) {
    let receipt = '';
    receipt += `***<store earning no money>Receipt ***\n`;
    receipt += formatGoodInfo(priceReceipt);
    receipt += '----------------------\n';
    receipt += 'Total: ' + priceReceipt.total.toFixed(2) + ' (yuan)\n';
    receipt += 'Saving: ' + priceReceipt.saving.toFixed(2) + ' (yuan)\n';
    receipt += '**********************';
    return receipt;
}

function printReceipt(idList) {
    let buyItemList = buildGoodsCartList(idList);
    let purchasedGoodsList = buildPurchasedGoods(buyItemList);
    let purchasedGoodsWithPriceList = calculateGoodsPrice(purchasedGoodsList);
    let receiptObject = buildPrintReceipt(purchasedGoodsWithPriceList);
    console.log(receiptObject);
    let receipt = printFullReceipt(receiptObject);
    console.log(receipt);
    return receipt;
}


function loadAllItems() {
    return [{
            barcode: 'ITEM000000',
            barcode: 'ITEM000000',
            name: 'Coca-cola',
            unit: 'bottles',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: 'Sprite',
            unit: 'bottles',
            price: 3.00
        },
        {
            barcode: 'ITEM000002',
            name: 'Apple',
            unit: 'g',
            price: 5.50
        },
        {
            barcode: 'ITEM000003',
            name: 'Litchi',
            unit: 'kg',
            price: 15.00
        },
        {
            barcode: 'ITEM000004',
            name: 'Battery',
            unit: 'a',
            price: 2.00
        },
        {
            barcode: 'ITEM000005',
            name: 'Noodles',
            unit: 'bags',
            price: 4.50
        }
    ];
}

function loadPromotions() {
    return [{
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
            'ITEM000000',
            'ITEM000001',
            'ITEM000005'
        ]
    }];
}

module.exports = {
    buildGoodsCartList,
    buildPurchasedGoods,
    resolveBarcode,
    countGoods,
    calculateGoodsPrice,
    calculatePromotionSubTotalPrice,
    calculateSubTotalPrice,
    buildPrintReceipt,
    printFullReceipt,
    loadAllItems,
    loadPromotions,
    printReceipt
};