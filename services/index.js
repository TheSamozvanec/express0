import customerService from "./customerService.js";
import orderProductService from "./orderProductService.js";
import orderService from "./orderService.js";
import productService from "./productService.js";
import userService from "./userService.js";


export default async function allInit() {
    await userService.init();
    await customerService.init();
    await productService.init();
    await orderService.init();
    await orderProductService.init();
}