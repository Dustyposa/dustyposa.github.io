---
title: 奇妙的对象模型及存储数据模型的技巧
tags: [python,advance]
category: [数据结构]
date: 2020-04-07 09:43:13
---

### 方便的数据结构之
## namedtuple 与 dataclass 以及 类结构进阶的基本使用

#### 目录
   - [namedtuple](#namedtuple)
   - [dataclass](#dataclass)
   - [Python对象模型](#Python对象模型)
   - [补充](#一些额外的补充)

其中，`nametuple` 和 `dataclasses` 个人觉得比较相似，这两个都是用来保存数据的，我们一起来看看区别吧。

在python内置模块 `collections` 中，有一个类为 `nametuple` 看名字我们可以大概猜出意思，有名字的元组。那么，这个 namedtuple 到底能做什么呢？  
我们通过代码来看一下,

namedtuple
---


```python
from collections import namedtuple  # 导入模块
```


```python
food = namedtuple("Foods", ["fruit", "price"])  # 初始化一个对象，但是并不能直接使用。我们需要向其中加入数据。
food
```




    __main__.Foods




```python
data_1 = food(fruit="apple", price=123)
data_1
```




    Foods(fruit='apple', price=123)




```python
# 访问数据
print(data_1.fruit)
print(data_1.price)
```

    apple
    123
    


```python
# 尝试更改数据
data_1.fruit = "banana"
```


    ---------------------------------------------------------------------------

    AttributeError                            Traceback (most recent call last)

    <ipython-input-5-acfec753951a> in <module>
          1 # 尝试更改数据
    ----> 2 data_1.fruit = "banana"
    

    AttributeError: can't set attribute


#### 基本操作就是如上，可以看到我们通过 `namedtuple` 可以获得一个对象，并且可以通过属性访问.  
#### 并且与元组 `tuple` 相同，不能更改属性，也就是对象一旦创立，遍不能更改，即不可变性依然保持着。

> 那么问题来了，这玩意创建步骤也比较麻烦。到底有什么用呢？ 


#### **提高代码可读性！！！**
你没看错，就是提高代码可读性。  
举个栗子：
你需要用一个数据结构保存不会变的东西，我们假设这个东西是水果。这个东西需要保存两个值，假设值分别为: apple 13。  
我们看看元组怎么做：


```python
data = ("apple", 13)
data
```




    ('apple', 13)



emmm....对，很简单！一步就初始化出来了，但是我们要访问怎么办呢？这时候就只能用索引或者遍历了，如下：


```python
print(data[0])
print(data[1])
for d in data:
    print(d)
```

    apple
    13
    apple
    13
    

**这时候就有问题了，如果这是你自己写的代码还好，知道数据在哪个位置(但是数据多了，有时也会忘记)，但是如果是别人来看的话，可能就比较懵逼了，需要不断的查看代码段。**  
别怕，我们有 `namedtuple` ，来，我们看看 `namedtuple` 有什么特效。  
数据，两个值，那么 这两个值肯定有含义的对吧， 对吧？（不要抬杠哦！）， 我们假设含义是 水果种类 和 价格   
那么我们就可以取两个名字，为了方便认识，我们就叫 `fruit` 和 `name`吧。（不要告诉我你要用 a，b 命名。。如果打算这样命名，还是直接用元组吧。）  


```python
# 首先呢，我们创建一个不可变的容器，这容器就叫 Fruit 吧，这个 Fruit 就保存两个值，取名如上
super_fruit = namedtuple("Fruit", ["name", "price"])  # 创建容器
# 保存数据 gogogo
data = super_fruit(name="apple", price=13)
# 一个不够，再来一个
data2 = super_fruit(name="big apple", price=26)
# 继续访问数据
print(data.name, data.price)
print(data2.name, data2.price)
```

    apple 13
    big apple 26
    

#### 划重点 (namedtuple)

通过 namedtuple 我们也能得到不可变的数据结构，并且可以通过属性来进行访问，大大提高了代码的可读性，并且更加 pythonic 。  
如有元组的情况，如果结构比较复杂的话，强烈推荐使用哦！  
[namedtuple 进阶](#namedtuple_advance)

### 这个特殊的东西我们就先打住，我们换一个新东西 3.6 中的新模块 dataclasses 中的 dataclass(没错，这个也是用来保存数据的，并且可以数据可变)。 
`dataclass` 用来干什么， 老规矩，我们先设想一个场景-用类来保存属性，通过属性来访问值，我们用正常的代码来看看。

### dataclass


```python
# 假设需要一个对象类，代表测试环境数据库的连接，我们需要给一堆属性用于配置, 并添加默认参数
class TestEnv:
    def __init__(self, port=3306, host="localhost", db="test_database", tb_name="table_name"):
        self.port = port
        self.host = host
        self.db = db
        self.tb_name = tb_name
"""当然，你也可以这样写：
class TestEnv:
    def __init__(self):
        self.port = 3306
        self.host = "localhost"
        self.db = "test_database"
        self.tb_name = "table_name"
"""
# 我们来点 pythonic 的写法，加上类型注释
class PythonicTestEnv:
    def __init__(self, port: int=3306, host: str="localhost", db: str="test_database", tb_name: str="table_name"):
        self.port = port
        self.host = host
        self.db = db
        self.tb_name = tb_name
```

我们实例化对象后查看一下属性


```python
env = TestEnv()
print(env.port)
print(env.tb_name)

env = PythonicTestEnv()
print(env.port)
print(env.tb_name)
```

    3306
    table_name
    3306
    table_name
    

当然，属性与 `namedtuple` 不同，是可以改变的。


```python
env.port = 3308
print(env.port)
env
```
```
3308
>>> <__main__.PythonicTestEnv at 0x104092be0>
```


所有要保证数据的不可变性的话，还是推荐使用 `namedtuple`, 但是对于这种纯数据的对象这样写比较繁琐，所以，何不试试新方法～ go！


```python
from dataclasses import dataclass
```


```python
@dataclass
class DCTestEnv:
    port: int=3306
    host: str="localhost"
    db: str="test_database"
    tb_name: str="table_name"
```


```python
env = DCTestEnv()
print(env.port)
print(env.tb_name)
env
```
```
3306
table_name
>>>  DCTestEnv(port=3306, host='localhost', db='test_database', tb_name='table_name')
```


**看，是不是一气呵成，简单方便。**  
细心的同学可能会发现，当对象在交互模式出现时，**输出的结果不一样！**  
没错 `dataclass` 还帮我们把 `__repr__` 也重写好了(**划重点**)！是不是很方便！没错 dataclass 最重要的就是 省代码！省代码！省代码！ 重要的事说三遍！方便快捷，选他没错！

> 但其实不止这些方法，`dataclass` 还帮我们重写了 \_\_eq\_\_ 什么的，我们也可以重写这些方法。

**好了，小技巧引入完了，我们来进入正题，面向对象知识的进阶！**

Python对象模型
---

这里我们通过两个对象来引入：
   - 卡牌
   - 向量


#### 卡牌对象(FrenchDeck)

这是一副扑克，记录了扑克的所有卡牌。
   - 有一个 _cards 属性保存了所有的卡牌，每一张卡牌只有花色和卡牌大小

要是你会怎么设计这个对象呢？
我们来看看常规思路。
   - 因为卡牌比较多，所以这个 _cards 肯定是循环生成的。
   - 因为每张卡牌固定有两个属性，所以我们用不可变对象来保存能更节省空间。
   - 不可变对象，要保存花色和卡牌，我们可以用字符串或者元组来实现。
   - 但是字符串肯定不太合适，花色和大小相关度不是很高，也不便于维护。
   - 所以我们用元组来实现。  
   
代码如下：


```python
class FrenchDeck:
    ranks = [str(i) for i in range(2, 11)] + list('JDKA')
    suits = ["黑桃", "方块", "梅花", "红桃"]
    def __init__(self):
        self._cards = [(suit, rank) for suit in self.suits
                     for rank in self.ranks]
```

**我们实例化对象看看效果**


```python
puke_cards = FrenchDeck()
puke_cards._cards
```




    [('黑桃', '2'),
     ('黑桃', '3'),
     ('黑桃', '4'),
     ('黑桃', '5'),
     ('黑桃', '6'),
     ('黑桃', '7'),
     ('黑桃', '8'),
     ('黑桃', '9'),
     ('黑桃', '10'),
     ('黑桃', 'J'),
     ('黑桃', 'D'),
     ('黑桃', 'K'),
     ('黑桃', 'A'),
     ('方块', '2'),
     ('方块', '3'),
     ('方块', '4'),
     ('方块', '5'),
     ('方块', '6'),
     ('方块', '7'),
     ('方块', '8'),
     ('方块', '9'),
     ('方块', '10'),
     ('方块', 'J'),
     ('方块', 'D'),
     ('方块', 'K'),
     ('方块', 'A'),
     ('梅花', '2'),
     ('梅花', '3'),
     ('梅花', '4'),
     ('梅花', '5'),
     ('梅花', '6'),
     ('梅花', '7'),
     ('梅花', '8'),
     ('梅花', '9'),
     ('梅花', '10'),
     ('梅花', 'J'),
     ('梅花', 'D'),
     ('梅花', 'K'),
     ('梅花', 'A'),
     ('红桃', '2'),
     ('红桃', '3'),
     ('红桃', '4'),
     ('红桃', '5'),
     ('红桃', '6'),
     ('红桃', '7'),
     ('红桃', '8'),
     ('红桃', '9'),
     ('红桃', '10'),
     ('红桃', 'J'),
     ('红桃', 'D'),
     ('红桃', 'K'),
     ('红桃', 'A')]



emmmm..有点感觉，我们试着随机访问几个元素看看


```python
from random import randint

for i in range(3):
    card = puke_cards._cards[randint(0, 53)]
    print(card, card[0], card[1])
```

    ('梅花', '7') 梅花 7
    ('梅花', 'J') 梅花 J
    ('方块', 'J') 方块 J
    

> 元素比较少，还能勉强猜出意思。我们用刚学的 nametuple 来看看。

#### nametuple 参与创建卡牌


```python
import collections

Card = collections.namedtuple('Card', ['rank', 'suit'])


class FrenchDeck:
    ranks = [str(n) for n in range(2, 11)] + list('JQKA')
    suits = '黑桃 方块 梅花 红桃'.split()

    def __init__(self):
        self._cards = [Card(rank, suit) for suit in self.suits
                       for rank in self.ranks]

    def __len__(self):
        return len(self._cards)

    def __getitem__(self, position):
        return self._cards[position]

```


```python
print(FrenchDeck.ranks)  # 生成需要的卡牌列表
FrenchDeck.suits  # 卡牌花色
```



```
 ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
 >>> ['黑桃', '方块', '梅花', '红桃']
```



```python
fcards = FrenchDeck()  # 实例化对象
fcards._cards  # 查看以下 nametuple 的出来的卡牌，是不是更加直观好看
```




    [Card(rank='2', suit='黑桃'),
     Card(rank='3', suit='黑桃'),
     Card(rank='4', suit='黑桃'),
     Card(rank='5', suit='黑桃'),
     Card(rank='6', suit='黑桃'),
     Card(rank='7', suit='黑桃'),
     Card(rank='8', suit='黑桃'),
     Card(rank='9', suit='黑桃'),
     Card(rank='10', suit='黑桃'),
     Card(rank='J', suit='黑桃'),
     Card(rank='Q', suit='黑桃'),
     Card(rank='K', suit='黑桃'),
     Card(rank='A', suit='黑桃'),
     Card(rank='2', suit='方块'),
     Card(rank='3', suit='方块'),
     Card(rank='4', suit='方块'),
     Card(rank='5', suit='方块'),
     Card(rank='6', suit='方块'),
     Card(rank='7', suit='方块'),
     Card(rank='8', suit='方块'),
     Card(rank='9', suit='方块'),
     Card(rank='10', suit='方块'),
     Card(rank='J', suit='方块'),
     Card(rank='Q', suit='方块'),
     Card(rank='K', suit='方块'),
     Card(rank='A', suit='方块'),
     Card(rank='2', suit='梅花'),
     Card(rank='3', suit='梅花'),
     Card(rank='4', suit='梅花'),
     Card(rank='5', suit='梅花'),
     Card(rank='6', suit='梅花'),
     Card(rank='7', suit='梅花'),
     Card(rank='8', suit='梅花'),
     Card(rank='9', suit='梅花'),
     Card(rank='10', suit='梅花'),
     Card(rank='J', suit='梅花'),
     Card(rank='Q', suit='梅花'),
     Card(rank='K', suit='梅花'),
     Card(rank='A', suit='梅花'),
     Card(rank='2', suit='红桃'),
     Card(rank='3', suit='红桃'),
     Card(rank='4', suit='红桃'),
     Card(rank='5', suit='红桃'),
     Card(rank='6', suit='红桃'),
     Card(rank='7', suit='红桃'),
     Card(rank='8', suit='红桃'),
     Card(rank='9', suit='红桃'),
     Card(rank='10', suit='红桃'),
     Card(rank='J', suit='红桃'),
     Card(rank='Q', suit='红桃'),
     Card(rank='K', suit='红桃'),
     Card(rank='A', suit='红桃')]



同样我们访问元素看看


```python
for i in range(3):
    card = fcards._cards[randint(0, 53)]
    print(card, card.rank, card.suit)
```

    Card(rank='5', suit='方块') 5 方块
    Card(rank='5', suit='黑桃') 5 黑桃
    Card(rank='J', suit='红桃') J 红桃
    

> 通过属性访问，是不是可读性提高很多了呢？

### 奇妙的对象模型

#### 神奇的魔术方法（magic mthod） 或者 双下方法（dunder method）

今天我们介绍两个简单的魔术方法，因为魔术方法很多以后会慢慢添加。
 - `__len__`
 - `__getitem__`
 
可以看名字直接猜猜意思哦！

#### `__len__`


```python
# len:
class A:
    def __len__(self):
        print("Attention __len__ is called!!!")
        return 12
```

其实看名字我们就能猜出个八九不离十，肯定和长度有关嘛。首先随便定义一个类，看看有什么神奇的效果！


```python
test_len = A()
len(test_len)
```

    Attention __len__ is called!!!
    >>>  12



没错，其实 `len(object)` 时，就是重载了 `object.__len__`方法，不过用 `len(obj)` 看起来更加优雅哦。  
next one！

#### `__getitem__`


```python
class B:
    def __getitem__(self, item):
        print(item)
        return "Attention item is calling"
```


```python
B()[0]
```
    0
    >>> 'Attention item is calling'



没错 `__getitem__` 就是当索引对象时重载的方法。  
当然，我们也可以传一些奇怪的索引给对象！


```python
B()["pythonic!"]
```

    pythonic!
    >>>  'Attention item is calling'



> !没错！这就变成字典的索引！是不是很神奇呢？
但是有些时候重写这两个方法也不是一件容易的事，但是我们可以偷偷懒。  
如同定义 FrenchDeck 的操作。  
利用原对象的特性！我们让 FrenchDeck 也具有了长度和索引的技能！



```python
len(fcards)
```




    52




```python
fcards[randint(0, 53)]
```




    Card(rank='J', suit='红桃')



**如果自定义对象也需要这两个方法的时候，可以重点研究尝试一下！**

### 总结
学到哪，总结到哪！我们简单回顾一下我们学的：
- [神奇的元组（namedtuple）](#namedtuple)  
    - 用对象属性访问值的元组！更加 pythonic ！
- [简便的数据模型 （dataclass）](#dataclass)
    - 几行代码创建一个数据模型类！方便快捷！
- [奇妙的对象模型](#奇妙的对象模型)
    - [`__len__`](#`__len__`)
    - [`__getitem__`](#`__getitem__`)

### 一些额外的补充
- #### 一些常见的运算魔术方法。
- #### namedtuple 的高阶使用。


