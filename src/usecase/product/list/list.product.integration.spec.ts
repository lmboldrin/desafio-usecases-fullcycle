import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";

describe("Test list product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a products", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const product1 = new Product("123", "Product 1", 10);
    const product2 = new Product("456", "Product 2", 20);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const result = await usecase.execute({});

    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe("123");
    expect(result.products[0].name).toBe("Product 1");
    expect(result.products[0].price).toBe(10);
    expect(result.products[1].id).toBe("456");
    expect(result.products[1].name).toBe("Product 2");
    expect(result.products[1].price).toBe(20);
  });
});
