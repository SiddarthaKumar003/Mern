import checkPermission from "../helper/checkPermission.js";
import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
    try {
        console.log("Requested user details:", req?.user?._id);
        const isPermission = checkPermission(req.user?._id)
        if (!isPermission) {
            res.status(500).json({
                success: false,
                message: 'Permission denied to upload product',
            });
        }
        const { productName, brandName, category, productImage, price, sellingPrice, description } = req.body;

        const newProduct = new Product({
            productName,
            brandName,
            category,
            productImage,
            price,
            sellingPrice,
            description,
        });

        await newProduct.save();
        console.log("Uploaded product", newProduct);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// Update product details
export const updateProduct = async (req, res) => {
    try {
        const isPermission = checkPermission(req.user?._id)
        if (!isPermission) {
            res.status(500).json({
                success: false,
                message: 'Permission denied to upload product',
            });
        }
        const { userId } = req.params;
        const { productName, brandName, category, productImage, price, sellingPrice, description } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(userId, {
            productName,
            brandName,
            category,
            productImage,
            price,
            sellingPrice,
            description,
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {

        // Here no authentication is needed any one see all the products
        // The user can be ADMIN or GENERAL
        const allProducts = await Product.find();

        if (!allProducts) {
            return res.status(404).json({
                success: false,
                message: 'Products not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: allProducts
        });

    } catch (error) {
        console.log("Error while getting the products:", error);
    }
}

export const getCatagoryWiseProduct = async (req, res) => {
    try {
        const catagories = await Product.find().distinct("category")
        // console.log("Catagories", catagories);

        // catagorywise product data
        const catagoryWiseProductData = []

        for (const category of catagories) {
            const firstProduct = await Product.findOne({ category }).sort({ _id: 1 });
            if (firstProduct) {
                catagoryWiseProductData.push(firstProduct);
            }
        }
        res.status(200).json({
            success: true,
            message: 'Product fetched catagory wise successfully',
            data: catagoryWiseProductData
        });
        // console.log("Products data catagory wise:",catagoryWiseProductData);

    } catch (error) {
        console.log("Something went wrong for getting the product catagorywise", error);
    }
}

export const getCatagoryWiseProducts = async (req, res) => {
    try {
        const catagory = req.body.catagory;
        console.log("Request body", catagory);
        const catagories = await Product.find({
            category: catagory
        })
        // catagorywise product data
        res.status(200).json({
            success: true,
            message: 'Product fetched catagory wise successfully',
            data: catagories
        });

    } catch (error) {
        console.log("Something went wrong for getting the product catagorywise", error);
    }
}

export const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.body;
        const productData = await Product.findById(productId)
        // console.log("Product Data", productData);

        // catagorywise product data
        res.status(200).json({
            success: true,
            message: 'Product fetched catagory wise successfully',
            data: productData
        });

    } catch (error) {
        console.log("Something went wrong for getting the product catagorywise", error);
    }
}

export const searchProduct = async (req, res) => {
    console.log("Its coming inside the srarch product controller");
    const { query } = req.query
    console.log("Query", query);
    if (!query) {
        res.status(400).json({
            success: false,
            message: "query is required inside the url"
        })
    }

    // finally search the product if the query exist
    try {
        const searchedProducts = await Product.find(
            {
                $or: [
                    { productName: { $regex: query, $options: 'i' } },
                    { brandName: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            }
        )

        res.status(200).json({
            success: true,
            message: "Searched Item Fetched Successfully",
            data: searchedProducts
        })
    } catch (error) {
        console.log("Product fetching issue:", error);
    }

}

export const getFilteredProduct = async(req,res)=>{
    try {
        const {category,brands,priceSort,page=1,limit=12} = req.query
        // query for filter
        console.log("Category:",category);
        console.log("Category:",category);
        console.log("Brands:",brands);
        console.log("PriceSort:",priceSort);
        const filter = {}
        if(category) filter.category={$in:category.split(",")}
        if(brands) filter.brandName={$in:brands.split(",")}

        // appening the sorting the options
        const sortOption = {}
        if(priceSort==='lowToHigh')
            sortOption.sellingPrice = 1;
        else if(priceSort==='highToLow')
            sortOption.sellingPrice = -1;


        console.log("Filter obj",filter);

        // query to get the filtered data
        const filteredData = await Product.find(filter)
                            .sort(sortOption)
                            .skip((page-1)*limit)
                            .limit(parseInt(limit))

        // finding the total document count
        const totalProducts = await Product.countDocuments(filter)

        res.status(200).json({
            success:true,
            data:filteredData,
            totalProducts,
            totalPages:Math.ceil(totalProducts/limit),
            currentPage:page
        })

    } catch (error) {
        console.log("Error while fetching filtered products",error);
    }
}