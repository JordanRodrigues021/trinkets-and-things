const { default: Airtable } = require('airtable');

exports.handler = async (event, context) => {
    try {
        // Initialize Airtable
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
        
        // Parse the incoming order data
        const orderData = JSON.parse(event.body);
        
        // Prepare the order record for Airtable
        const orderRecord = {
            "CustomerName": orderData.customerName,
            "CustomerEmail": orderData.customerEmail,
            "CustomerPhone": orderData.customerPhone,
            "Items": JSON.stringify(orderData.items),
            "Total": orderData.total,
            "Status": "Unconfirmed",
            "PaymentMethod": orderData.paymentMethod,
            "PaymentConfirmed": orderData.paymentMethod === 'Cash' ? true : false,
            "OrderDate": new Date().toISOString()
        };
        
        // Add the order to Airtable
        const record = await base('Orders').create([{ fields: orderRecord }]);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Order processed successfully',
                orderId: record[0].getId()
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to process order',
                details: error.message 
            })
        };
    }
};