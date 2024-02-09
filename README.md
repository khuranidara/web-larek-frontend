# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура
![Image alt](C:\Users\Dasha\Documents\Git\web-larek-frontend\UML_scheme.png)
## Базовый код
## Компоненты модели данных
1. ### Класс `PRODUCT`
Хранит информацию о продукте, использует следующие типы данных: `PRODUCT_ID` - string уникальный идентификатор товара, `DESCRIPTION` - string описание товара,
`CATEGORY` - string категория товара, `TITLE` - string название товара, `IMAGE_URL` - string изображение товара, `PRICE` - number цена товара.
2. ### Класс `CUSTOMER`
Этот класс относится к слою Модели, так как он представляет данные о пользователе,  такие как `ID` - string, `PAY_TYPE` - number,    `ADDRESS` - string, `EMAIL` - string, `PHONE` - string
и `PRODUCTS` -  products[]. Символ **(*)** перед параметрами `ADDRESS` и `PHONE` в модели данных `CUSTOMER` указывает на то, что эти параметры **являются обязательными**, то есть их значение должно 
быть предоставлено при создании экземпляра объекта `CUSTOMER`. Это облегчает последующую валидацию данных.
## Компоненты представления
**Представления** отвечают за отображение данных и взаимодействие с пользователем. Они отображают карточки товаров, корзину, форму оформления заказа и другие интерфейсные элементы.
1. ### Класс `PRODUCTS`
Содержит метод для получения доступных товаров `GetAvailableProducts():products[]`. `GetProduct(ID: product)`: Метод для получения товара по его идентификатору.
2. ### Класс `CART`
`OpenCartWindow()`: Метод для открытия окна корзины. `CloseCartWindow()`: Метод для закрытия окна корзины. `AddProductToCart(ID: string)`: Метод для добавления товара в корзину.
`RemoveProductFromCart(INDEX: number)`: Метод для удаления товара из корзины по его индексу. `CalculateOverallProductsPrice()`: Метод для расчета общей стоимости товаров в корзине.
3. ### Класс `CHECKOUT`
`OpenCheckoutWindow()`: Метод для открытия окна оформления заказа. `CloseCheckoutWindow()`: Метод для закрытия окна оформления заказа. `UpdatePayType(type: number)`: Метод для обновления типа оплаты.
`UpdateAddress(address: string)`: Метод для обновления адреса доставки. `UpdateEmail(email: string)`: Метод для обновления email пользователя. `UpdatePhone(phone: string)`: Метод для обновления номера телефона пользователя.
`ProceedToPayment()`: Метод для перехода к оплате.

**Product Model** связана с **Product Presenter**, который в свою очередь связан с **Home View (Products)** и **Card View**. **Product Model** также связана с **Cart Presenter**, который управляет **Cart View**.
**Product Model** также связана с **Customer Model**, которая используется в **Checkout Presenter**. **Checkout Presenter** связан с **Checkout View#1**, **Checkout View#2** и **Checkout Result View** для отображения процесса оформления заказа и его результатов.
Это базовое описание классов и их взаимосвязей в архитектуре приложения.