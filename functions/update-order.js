const { default: Airtable } = require('airtable');

exports.handler = async (event, context) => {
    try {
        // Initialize Airtable
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
        
        // Parse the incoming data
        const { orderId, status } = JSON.parse(event.body);
        
        // Update the order in Airtable
        await base('Orders').update([
            {
                "id": orderId,
                "fields": {
                    "Status": status
                }
            }
        ]);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Order updated successfully'
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to update order',
                details: error.message 
            })
        };
    }
};