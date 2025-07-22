import app  from './routes' // your Hono app


test('GET /deposits', async () => {
    
    const res = await app.request('/deposits')
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.length).toBe(3)
    expect(data[0].id).toBe(1)
    expect(data[1].id).toBe(2)
    expect(data[2].id).toBe(3)

})

test('PUT /deposits/update-balance', async () => {
    // Test a GET endpoint
    const res = await app.request('/deposits/update-balance', {
    method: 'PUT',
    body: ` {
                "deposits": [
                    {
                        "id": 1,
                        "planType": "premium",
                        "balance": 23321,
                        "days": 400
                    }
                ]
            }`
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({"message": "Balances updated successfully"})
})