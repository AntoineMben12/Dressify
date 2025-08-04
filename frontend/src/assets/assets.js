import Greencap from './green-cap.jpg';
import blackShirt from './Black Hoodie Shirt.jpg';
import diamondShirt from './Diamond Striped Shirt.jpg';
import handbag from './Handbag Shoulder Bag.jpg';
import chinoTrousers from './Man Chino Trousers.jpg';
import menPlusLight from './Men Plus Light.jpg';
import oversizedShirt from './Oversized Gray Shirt.jpg';
import womenShoes from './Women Latte shoes.jpg';
import heroMain from './hero_main.jpg';
import mage1 from './mage1.jpg';
import mage2 from './mage2.jpg';
import mage3 from './mage3.jpg';
import mage4 from './mage4.jpg';


export const category = {
    shirt: [
        {
            name: "Black Hoodie Shirt",
            price: 25.00,
            image: blackShirt,
            category: "shirt",
        },
        {
            name: "Diamond Striped Shirt",
            price: 35.00,
            image: diamondShirt,
            category: "shirt",
        },
        {
            name: "Oversized Gray Shirt",
            price: 28.00,
            image: oversizedShirt,
            category: "shirt",
        },
        {
            name: "Men Plus Light",
            price: 32.00,
            image: menPlusLight,
            category: "shirt",
        }
    ],
    cap: [
        {
            name: "Green Cap",
            price: 10.00,
            image: Greencap,
            category: "cap",
        }
    ],
    trousers: [
        {
            name: "Man Chino Trousers",
            price: 45.00,
            image: chinoTrousers,
            category: "trousers",
        }
    ],
    bag: [
        {
            name: "Handbag Shoulder Bag",
            price: 55.00,
            image: handbag,
            category: "bag",
        }
    ],
    shoes: [
        {
            name: "Women Latte Shoes",
            price: 65.00,
            image: womenShoes,
            category: "shoes",
        }
    ],
    hero: [
        {
            name: "Hero Collection",
            price: 0.00,
            image: heroMain,
            category: "hero",
        }
    ],
    mage: [
        {
            name: "Mage Collection 1",
            price: 80.00,
            image: mage1,
            category: "mage",
        },
        {
            name: "Mage Collection 2",
            price: 75.00,
            image: mage2,
            category: "mage",
        },
        {
            name: "Mage Collection 3",
            price: 85.00,
            image: mage3,
            category: "mage",
        },
        {
            name: "Mage Collection 4",
            price: 90.00,
            image: mage4,
            category: "mage",
        }
    ]
}
