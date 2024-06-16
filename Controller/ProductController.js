const ItemModal = require("../Model/ProductModal")
const jwt = require("jsonwebtoken")
const SubUserModal = require("../Model/SubUserModal")
const e = require("express");
const QRCode = require('qrcode');
const PDFDocument = require("pdfkit");
const path = require("path");
const { search } = require("../Routes/ProductRoutes");


exports.productCreation = async (req, res) => {

    if(req.userType === "user"){
        const { productName, abv, category, description, type, style, producer, quantity, pricintList, imageUrl } = req.body;

        const userId = req.userId;
        try {
            // Find the highest position for the user's products
            const highestPositionProduct = await ItemModal.findOne({ userId }).sort('-position').exec();
            const highestPosition = highestPositionProduct ? highestPositionProduct.position : -1;

            const newProduct = new ItemModal({
                userId,
                productName,
                abv,
                category,
                description,
                type,
                style,
                producer,
                quantity,
                pricintList,
                imageUrl,
                position: highestPosition + 1, // Set position to be one greater than the highest current position
            });

            const savedProduct = await newProduct.save();
            res.status(201).json({
                status: "success",
                message: "Product added successfully",
                data: savedProduct,
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: "error",
                message: "Error adding product",
                error,
            });
        }
    }
    else {
        res.status(400).json({
            status: "error",
            message: "You are not authorized. Please sign in as a user to continue",
        })
    }
}


exports.getUserProductsByCategory = async (req, res) => {
    if (req.userType === "subUser") {
        const subUser = await SubUserModal.findById(req.userId);
        if (subUser) {
            const Record = await ItemModal.find({ userId: subUser.parentUser, category: req.body.category, active: true }).sort('position');
            if (Record) {
                res.status(200).json({
                    status: "success",
                    message: "Get All Products Successfully",
                    data: Record,
                });
            } else {
                res.status(400).json({
                    status: "error",
                    message: "Something Went Wrong",
                });
            }
        } else {
            res.status(400).json({
                status: "error",
                message: "Something Went Wrong",
            });
        }
    } else if (req.userType === "user") {
        const Record = await ItemModal.find({ userId: req.userId, category: req.body.category }).sort('position');
        if (Record) {
            res.status(200).json({
                status: "success",
                message: "Get All Products Successfully",
                data: Record,
            });
        } else {
            res.status(400).json({
                status: "error",
                message: "Something Went Wrong",
            });
        }
    } else {
        res.status(400).json({
            status: "error",
            message: "You are not signed in. Please sign in to continue",
        });
    }
};


exports.getAllUserProducts = async (req, res) => {
    
    if (req.userType === "user") {
        try {
            const Record = await ItemModal.find({ userId: req.userId }).sort('position');
            if (Record) {
                res.status(200).json({
                    status: "success",
                    message: "Get All Products Successfully",
                    data: Record,
                });
            } 
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "Server error",
                error,
            });
        }
    } else {
        res.status(400).json({
            status: "error",
            message: "You are not authorized. Please sign in as a user to continue",
        });
    }
};


// exports.setProductStatus = async (req, res) => {
//     if (req.userType === "user") {
//         try {
//             const data = await ItemModal.findOneAndUpdate(
//                 { _id: req.body._id },
//                 {
//                     active: req.body.active,
//                 },
//                 { new: true }
//             );
//             if (data) {
//                 return res.status(200).json({
//                     status: 200,
//                     data: data,
//                 });
//             } else {
//                 return res.status(400).json({
//                     status: 400,
//                     message: "Product not found",
//                 });
//             }
//         } catch (error) {
//             return res.status(400).json({
//                 status: 400,
//                 message: error,
//             });
//         }
//     } else {
//         res.status(400).json({
//             status: "error",
//             message: "You are not authorized. Please sign in as a user to continue",
//         });
//     }
// };



// exports.updateProductItem = (req, res) => {
//     ItemModal.findOneAndUpdate(
//         { _id: req.body._id },
//         {
//             active: req.body.active,
//         },
//         { new: true },
//         (error, data) => {
//             if (data) {
//                 return res.status(200).json({
//                     status: 200,
//                     data: data,
//                 });
//             } else {
//                 return res.status(400).json({
//                     status: 400,
//                     message: "Something went wrong",
//                 });
//             }
//         }
//     );
// };

exports.updateProductItem = async (req, res) => {
    const { _id, updates } = req.body;

    try {
        const updatedProduct = await ItemModal.findByIdAndUpdate(_id, updates, { new: true });
        res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error updating product",
            error,
        });
    }
};

// userId,
// productName,
// abv,
// category,
// description,
// type,
// style,
// producer,
// quantity,
// pricintList,
// imageUrl,
// active

// exports.updateItemCompletely = async (req, res) => {
//     if(req.userType === "user"){
//         await ItemModal.findOneAndUpdate(
//             { _id: req.body._id },
//             {
//                 productName: req.body.productName,
//                 abv: req.body.abv,
//                 category: req.body.category,
//                 description: req.body.description,
//                 type: req.body.type,
//                 style: req.body.style,
//                 producer: req.body.producer,
//                 quantity: req.body.quantity,
//                 imageUrl: req.body.imageUrl,
//                 userId: req.userId

//             },
//             { new: true },
//             (error, data) => {
//                 if (data) {
//                     return res.status(200).json({
//                         status: 200,
//                         data: data,
//                     });
//                 } else {
//                     return res.status(400).json({
//                         status: 400,
//                         message: "Something went wrong",
//                     });
//                 }
//             }
//         );
//     }
//     else {
//         res.status(400).json({
//             status: "error",
//             message: "You are not authorized. Please sign in as a user to continue",
//         })
//     }
// };




exports.findItemById = async (req, res) => {

    try {
        const record = await ItemModal.findById(req.body._id);
        if (record) {
            return res.status(200).json({
                status: 200,
                record: record,
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: "Product not found",
            });
        }
    } catch (err) {
        return res.status(400).json({
            status: 400,
            message: "Something went wrong",
            error: err,
        });
    }
};





exports.deleteItemById = async (req, res) => {
    if(req.userType === "user"){
        try {
            const productToDelete = await ItemModal.findById(req.body._id);
            if (!productToDelete) {
                return res.status(404).json({
                    status: "error",
                    message: "Product not found",
                });
            }
    
            // Delete the product
            await ItemModal.findByIdAndDelete(req.body._id);
    
            // Get the remaining products for the user, ordered by position
            const remainingProducts = await ItemModal.find({ userId: productToDelete.userId }).sort('position').exec();
    
            // Update the positions of the remaining products
            const updates = remainingProducts.map((product, index) => {
                return ItemModal.findByIdAndUpdate(product._id, { position: index }, { new: true });
            });
    
            await Promise.all(updates);
    
            res.status(200).json({
                status: "success",
                message: "Product deleted and positions updated successfully",
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error deleting product",
                error,
            });
        }
    }
    else {
        res.status(400).json({
            status: "error",
            message: "You are not authorized. Please sign in as a user to continue",
        })
    }
}

// exports.generateQRCode = async (req, res) => {
//     try {
//         // Generate a link for active products
//         const link = `https://yeasty.vrexx.org:4000/product/api/active?category=${req.query.category}`;
        
//         // Generate QR Code
//         QRCode.toDataURL(link, (err, url) => {
//             if (err) {
//                 return res.status(500).json({
//                     status: "error",
//                     message: "Failed to generate QR code",
//                     error: err
//                 });
//             }

//             return res.status(200).json({
//                 status: "success",
//                 message: "QR code generated successfully",
//                 link: link,
//                 qrcode: url
//             });
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: "error",
//             message: "Server error",
//             error: error
//         });
//     }
// };

// Generate Link for Active Products
exports.generateLinkForActiveProducts = (req, res) => {
    try {
        const link = `${process.env.BACKEND_URL}/product/api/active?category=${req.query.category}`;
        return res.status(200).json({
            status: "success",
            message: "Link generated successfully",
            link: link
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Server error",
            error: error
        });
    }
};

// Generate QR Code for a Given Link
exports.generateQRCodeForLink = (req, res) => {
    const { link } = req.body;

    try {
        QRCode.toDataURL(link, (err, url) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to generate QR code",
                    error: err
                });
            }

            return res.render('displayQRCode', { qrcode: url });
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Server error",
            error: error
        });
    }
};

exports.generateQRCodePDF = (req, res) => {

    const { link } = req.body;

    try {
        QRCode.toDataURL(link, async (err, url) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to generate QR code",
                    error: err
                });
            }

            const doc = new PDFDocument();
            const pdfPath = path.join(__dirname, 'QRCode.pdf');

            // Set response headers for file download
            res.setHeader('Content-Disposition', 'attachment; filename=QRCode.pdf');
            res.setHeader('Content-Type', 'application/pdf');

            // Pipe the PDF document to the response
            doc.pipe(res);

            // Add the QR code image to the PDF document
            doc.image(url, {
                fit: [250, 250],
                align: 'center',
                valign: 'center'
            });

            // doc.text(link, {
            //     align: 'center'
            // });

            // Finalize the PDF and end the stream
            doc.end();
        });

    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Server error",
            error: error
        });
    }
}

exports.getInventoryItems = async (req, res) => {

    if(req.userType === "user"){
        try {
            const inventoryItems = await ItemModal.find(req.userId).sort('position');
            res.status(200).json({
                status: "success",
                data: inventoryItems,
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error fetching inventory items",
                error,
            });
        }
    } 
    else {
        res.status(400).json({
            status: "error",
            message: "You are not authorized. Please sign in as a user to continue",
        })
    }
};


// Get Active Products by Category
exports.getActiveProductsByCategory = async (req, res) => {
    const { category } = req.query;

    try {
        const categories = category.split(",");

        const query = {
            category: { $in: categories },
            active: true,
        };

        const products = await ItemModal.find(query).sort('position');

        return res.status(200).json({
            status: "success",
            message: "Get Active Products Successfully",
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Server error",
            error: error,
        });
    }
};




// exports.getActiveProductsByCategory = async (req, res) => {
//     const { category } = req.query;

//     try {
//         const categories = category.split(',');

//         const query = {
//             category: { $in: categories },
//             active: true
//         };

//         const products = await ItemModal.find(query);

//         return res.render('activeProducts', { products });
//     } catch (error) {
//         return res.status(500).json({
//             status: "error",
//             message: "Server error",
//             error: error
//         });
//     }
// };


// Reorder Products
exports.reorderProducts = async (req, res) => {
    const { reorderedProducts } = req.body;

    try {
        const updates = reorderedProducts.map((product, index) => {
            return ItemModal.findByIdAndUpdate(product._id, { position: index }, { new: true }).exec();
        });

        const updatedProducts = await Promise.all(updates);

        res.status(200).json({
            status: "success",
            message: updatedProducts,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error reordering products",
            error,
        });
    }
};

// Move Product Between Active and Inactive
// exports.moveProduct = async (req, res) => {
//     const { productId, active } = req.body;

//     try {
//         const updatedProduct = await ItemModal.findByIdAndUpdate(productId, { active }, { new: true });
//         res.status(200).json({
//             status: "success",
//             message: "Product moved successfully",
//             data: updatedProduct,
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "Error moving product",
//             error,
//         });
//     }
// };



exports.setProductStatus = async (req, res) => {
    if (req.userType === "user") {
        try {
            const data = await ItemModal.findOneAndUpdate(
                { _id: req.body._id },
                {
                    active: req.body.active,
                },
                { new: true }
            );
                res.status(200).json({
                    status: 200,
                    data: data,
                });
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: error,
            });
        }
    } else {
        res.status(400).json({
            status: "error",
            message: "You are not authorized. Please sign in as a user to continue",
        });
    }
};

// Live Search
exports.liveSearch = async (req, res) => {
    const { query } = req.body;
  
    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Query is required",
      });
    }
  
    try {
      const searchQuery = query.trim();
    //   const products = await ItemModal.find({
    //     $or: [
    //       { productName: { $regex: searchQuery, $options: "i" } },
    //       { description: { $regex: searchQuery, $options: "i" } },
    //     ],
    //   });
  
    const products = await ItemModal.find({
        productName: { $regex: searchQuery, $options: "i" }

    });
      return res.status(200).json({
        status: "success",
        data: products,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Server error",
        error: error.message,
      });
    }
  };
  