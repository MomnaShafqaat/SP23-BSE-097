const orderSchema = new mongoose.Schema({
   customerInfo: {
     name: { type: String, required: true },
     address: { 
       street: { type: String, required: true },
       city: { type: String, required: true },
       postalCode: { type: String, required: true }
     }
   },
   orderItems: [{
     product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
     quantity: Number
   }],
   orderTotal: { type: Number, required: true },
   orderDate: { type: Date, default: Date.now },
   status: {
     type: String,
     enum: ['Pending', 'Shipped', 'Delivered'],
     default: 'Pending',
   }
 });
 
 module.exports = mongoose.model('Order', orderSchema);
 