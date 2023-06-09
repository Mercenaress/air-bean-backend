# air-bean-backend

### Login for Admin and User:
http://localhost:5000/api/user/login
``` 
{ 
"username": "Admin",
"password": "69696969"
}

{
"username": "Regular Joe",
"password": "69696969"
}
```

### Sign Up: 
http://localhost:5000/api/user/signup
```
{
	"username": "Username",
	"password": "Fitting password",
	"role": "admin or user"
}
```
## All endpoints below this point are protected with admin access, send the Token in the Authorization header in the format of Bearer *token*

### Add Product:
http://localhost:5000/api/menu/addProduct
```
{
	"title": "Mazarin",
	"desc": "En klassiker till fikat",
	"price": 30
}
```

### Edit Product:
http://localhost:5000/api/menu/editProduct
```
{
	"title": "Caffé Doppio",
	"desc": "Ändra texten hur som i vilket som av title, desc och price. Den kollar efter ID",
	"price": 30,
	"id": "6MU8H48DnBHGm0md"
}
```

### Remove Product:
http://localhost:5000/api/menu/removeProduct
```
{
	"id": "6MU8H48DnBHGm0md"
}
```

### Add Campaign: 
http://localhost:5000/api/campaigns/addCampaign
```
{
	"products": [{"_id": "lTeWyAL2FhPwTkFT"}, 
		     {"_id": "jxrXyimhc5tIdTjF"}],
	"price": 50
}
```

## Original project by Space-Knights
## Above functionality added by me
