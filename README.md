<h1>Bank Interest Accrued calculator app</h1>

## Tech stack
- [x] Node Js
- [x] Sql Lite - inmemory
- [x] Sequelize - DB framework
- [x] Jest for testing

## Installation

```
yarn install
```

## Run Unit Test with Jest
This will run tests for all the test cases as per the requirement below and prepare the database will the required data
Cases
1. `UserId - 1 ` Investor creates their first investment for $10.000 on January 1st.
Expected result: Accrues $16.99 of interest on January, 31st.
(31 days * 2% / 365 days in a year * $10.000 balance)
2. `UserId - 2 `Investor creates their first investment for $10.000 on January 1st.
On January 5, they add $5.000.
Expected result: Accrues $24.38 of interest on January, 31st.
3. `UserId - 3 `Investor creates their first investment for $10.000 on January 1st.
On January 5, they withdraw $5.000.
Expected result: Accrues $9.59 of interest on January, 31st.
4. `UserId - 4 `Investor creates their first investment for $10.000 on January 1st.
On January 15, they add $5.000.
On January 27, they withdraw $5.000.
Expected result: Accrues $20.27 of interest on January, 31st.
<br />
<br />

```
yarn run test
```

## Run locally
Run ` yarn run test ` atleast once to have all the required data created 

```
yarn start-dev
```

## Testing from postman
All Test data will be created for Janaury

Use bellow GET requests to test from postman or browser after starting the application

### User - 1
```
http://localhost:3000/api/account/getInterestAccrued/1?month=0&year=2023

response:
{
    "interestAccrued": 16.99,
    "msg": "success"
}

```

### User - 2
```
http://localhost:3000/api/account/getInterestAccrued/2?month=0&year=2023

response:
{
    "interestAccrued": 24.38,
    "msg": "success"
}

```

### User - 3
```
http://localhost:3000/api/account/getInterestAccrued/3?month=0&year=2023

{
    "interestAccrued": 9.59,
    "msg": "success"
}

```

### User - 4
```
http://localhost:3000/api/account/getInterestAccrued/4?month=0&year=2023

{
    "interestAccrued": 20.27,
    "msg": "success"
}

```