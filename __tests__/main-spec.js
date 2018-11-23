const printReciept = require("../main");

describe('resolveBarcode', function() {
    it(`Given ['ITEM000001','ITEM000001','ITEM000002-5'], When call buildGoodsCartList, Then return a buy item list [{barcode: 'ITEM000001', quantity:1},{barcode: 'ITEM000001', quantity:1},{barcode: 'ITEM000002', quantity:5}]`, function() {
        let idList = ['ITEM000001', 'ITEM000001', 'ITEM000002-5'];
        let result = printReciept.resolveBarcode(idList);
        expect(result).toEqual([{ barcode: 'ITEM000001', quantity: 1 }, { barcode: 'ITEM000001', quantity: 1 }, { barcode: 'ITEM000002', quantity: 5 }]);
    });
});

describe('countGoods', function() {
    it(`Given [{ barcode: 'ITEM000001', quantity: 1 }, { barcode: 'ITEM000001', quantity: 1 }, { barcode: 'ITEM000002', quantity: 5 }], When call countBuyItems, Then return a buy item list [{ barcode: 'ITEM000001', quantity: 2 }, { barcode: 'ITEM000002', quantity: 5 }]`, function() {
        let goodsList = [{ barcode: 'ITEM000001', quantity: 1 }, { barcode: 'ITEM000001', quantity: 1 }, { barcode: 'ITEM000002', quantity: 5 }];
        let result = printReciept.countGoods(goodsList);
        expect(result).toEqual([{ barcode: 'ITEM000001', quantity: 2 }, { barcode: 'ITEM000002', quantity: 5 }]);
    });
});


describe('buildGoodsCartList', function() {
    it(`Given ['ITEM000001','ITEM000001','ITEM000002-5'], When call buildGoodsCartList, Then return a buy item list [{ barcode: 'ITEM000001', quantity: 2 }, { barcode: 'ITEM000002', quantity: 5 }]`, function() {
        let idList = ['ITEM000001', 'ITEM000001', 'ITEM000002-5'];
        let result = printReciept.buildGoodsCartList(idList);
        expect(result).toEqual([{ barcode: 'ITEM000001', quantity: 2 }, { barcode: 'ITEM000002', quantity: 5 }]);
    });
});

describe('buildPurchasedGoods', function() {
    it(`Given [{ barcode: 'ITEM000001', quantity: 2 }, { barcode: 'ITEM000002', quantity: 5 }], When call buildPurchasedGoods, Then return a buy item list [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 2 }, { barcode: 'ITEM000002', name: 'Apple', unit: 'g', price: 5.50, quantity: 5 }]`, function() {
        let buyItem = [{ barcode: 'ITEM000001', quantity: 2 }, { barcode: 'ITEM000002', quantity: 5 }];
        let result = printReciept.buildPurchasedGoods(buyItem);
        expect(result).toEqual([{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 2 }, { barcode: 'ITEM000002', name: 'Apple', unit: 'g', price: 5.50, quantity: 5 }]);
    });
});

describe('calculateGoodsPrice', function() {
    it(`Given [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 2 }], When call calculateGoodsPrice, Then return a buy item list [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 2, subTotal: 6.00 }]`, function() {
        let buyItem = [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 2 }];
        let result = printReciept.calculateGoodsPrice(buyItem);
        expect(result).toEqual([{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 2, subTotal: 6.00 }]);
    });
});

describe('calculateGoodsPrice', function() {
    it(`Given [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 3, subTotal: 9.00 }], When call calculateGoodsPrice, Then return a buy item list [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 3, subTotal: 9.00, promotionSubTotal: 6.00 }`, function() {
        let buyItem = [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 3, subTotal: 9.00 }];
        let result = printReciept.calculateGoodsPrice(buyItem);
        expect(result).toEqual([{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 3, subTotal: 9.00, promotionSubTotal: 6.00 }]);
    });
});


describe('calculateSubTotalPrice', function() {
    it(`Given [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 2 }], When call calculateSubTotalPrice, Then return a buy item list [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 2, subTotal: 6.00 }]`, function() {
        let buyItem = [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 2 }];
        let result = printReciept.calculateSubTotalPrice(buyItem);
        expect(result).toEqual([{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 2, subTotal: 6.00 }]);
    });
});


describe('calculatePromotionSubTotalPrice', function() {
    it(`Given { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 3, subTotal: 9.00 }] and promotion list, When call calculateSubTotalPrice, Then return a buy item list [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 3, subTotal: 9.00, promotionSubTotal: 6.00 }]`, function() {
        let buyItem = [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 3, subTotal: 9.00 }]
        let result = printReciept.calculatePromotionSubTotalPrice(buyItem, printReciept.loadPromotions());
        expect(result).toEqual([{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 3, subTotal: 9.00, promotionSubTotal: 6.00 }]);
    });
});

describe('printFullReceipt', function() {
    it(`Given {buyItemList:[{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 3, subTotal: 9.00, promotionSubTotal: 6.00 }, { barcode: 'ITEM000002', name: 'Apple', unit: 'g', price: 5.50, quantity: 3, subTotal: 16.50 }],total:123.00,saving:45.00}, When call printFullReceipt, Then return string`, function() {
        let buyItemList = { buyItemList: [{ barcode: 'ITEM000001', name: 'Sprite', unit: 'bottles', price: 3.00, quantity: 3, subTotal: 9.00, promotionSubTotal: 6.00 }, { barcode: 'ITEM000002', name: 'Apple', unit: 'g', price: 5.50, quantity: 3, subTotal: 16.50 }], total: 22.50, saving: 3.00 };
        let result = printReciept.printFullReceipt(buyItemList);
        expect(result).toEqual(`***<store earning no money>Receipt ***
Name: Sprite, Quantity: 3 bottles, Unit price: 3.00 (yuan), Subtotal: 6.00 (yuan)
Name: Apple, Quantity: 3 g, Unit price: 5.50 (yuan), Subtotal: 16.50 (yuan)
----------------------
Total: 22.50 (yuan)
Saving: 3.00 (yuan)
**********************`);
    });
});

describe('pos', () => {

    it('should print text', () => {

        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];

        spyOn(console, 'log');

        let result = printReciept.printReceipt(tags);

        const expectText = `***<store earning no money>Receipt ***
Name: Sprite, Quantity: 5 bottles, Unit price: 3.00 (yuan), Subtotal: 12.00 (yuan)
Name: Litchi, Quantity: 2.5 kg, Unit price: 15.00 (yuan), Subtotal: 37.50 (yuan)
Name: Noodles, Quantity: 3 bags, Unit price: 4.50 (yuan), Subtotal: 9.00 (yuan)
----------------------
Total: 58.50 (yuan)
Saving: 7.50 (yuan)
**********************`;

        // expect(console.log).toHaveBeenCalledWith(expectText);
        expect(result).toEqual(expectText);
    });

});