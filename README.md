# Leaders | React.js , Redis , MongoDB
Leaderboard with real time on the week

## Server Package
```nodejs
npm i express mongodb socket.io tedis
```

## Client Package
```nodejs
npm i @react-icons/all-files bootstrap react-icons socket.io-client
```


# Redis
- Data Type :  **Sorted Sets**
- Data Store Format : **DD.MM.YYYY** 
  - Example *(31.12.2021)*
- Redis allow chaining functions


## Redis Functions

#### zIncrBy (*key*, *amount*, *member*) : self (chaining)

```nodejs 
redis().zIncrBy("31.12.2021", req.params.amount, req.params.memberID); 
```

#### zAdd (*key*, *members*) : self (chaining)
- members parameter must be array . Array have must includes object and score , value property
```nodejs 
redis().zAdd("31.12.2021",[ { score:10,value:'MemberID' } ]); 
```

#### zRevRange (*key*, *limit*) : object (Promise)
- limit parameter not required but must be object and offset , count property when need
  - { offset: 0, count: 100 }
```nodejs 
redis().zRevRange("31.12.2021").then((res) => console.log(res)); 
```

#### zUnionStore (*key*,*union*,*limit*) : object (Promise)
- limit parameter not required but must be object and offset , count property when need
- union parameter must be array
```nodejs 
redis().zUnionStore("out",["31.12.2021","30.12.2021"]).then((res) => console.log(res)); 
```


#### zRevRank (*key*,*member*) : object (Promise)
```nodejs 
redis().zrevrank("31.12.2021","MemberID").then((res) => console.log(res)); 
```

#### zRevRankUnion (*union*,*member*) : object (Promise)
- union parameter must be array
```nodejs 
redis().zRevRankUnion(["31.12.2021","30.12.2021"],"MemberID").then((res) => console.log(res)); 
```


## Utils Functions

#### getKey (*...options*) : string
- options must be **string**
- getKey function return giving time to string
- Today date : 31.12.2021


```nodejs 
console.log(getKey("today"));
//Output : 31.12.2021

console.log(getKey("yesterday"));
//Output : 30.12.2021

console.log(getKey("lastdayofweek"));
//Output : 02.01.2022

console.log(getKey("firstdayofweek"));
//Output : 27.12.2021

console.log(getKey("isallweekday"));
/*Output : [
  '27.12.2021',
  '28.12.2021',
  '29.12.2021',
  '30.12.2021',
  '31.12.2021',
  '01.01.2022',
  '02.01.2022'
]*/

console.log( getKey("isallweekday", getKey("yesterday") ));
//if giving isallweekday parameter have a second parameter . Return first day of week - giving parameter 
/*Output : [ '27.12.2021', '28.12.2021', '29.12.2021', '30.12.2021' ] */
```

#### getTopLeaders ( *data = { offset: 0, count: 100 }* ) : void
- This functions need the **binding socket**

```nodejs 
getTopLeaders.bind(io)()
```

## Screen Shot

![Uygulama Ekran Görüntüsü](https://dogukandemir.net/img/screenOfLeader.jpg)
