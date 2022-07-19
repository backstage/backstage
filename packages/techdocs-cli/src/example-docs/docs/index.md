## hello mock docs

!!! test
Testing something

Abbreviations:
Some text about MOCDOC

This is a paragraph.
{: #test_id .test_class }

Apple
: A fruit.

```javascript
import { test } from 'something';

const addThingToThing = (a, b) a + b;
```

- [abc](#abc)
- [xyz](#xyz)

## abc

This is a b c.

## xyz

This is x y z.

# Emojis

:bulb: :smile:

# Code blocks

```javascript
import { test } from 'something';

const addThingToThing = (a, b) a + b;
```

# Grouped Code blocks

=== "JavaScript"

    ```javascript
    import { test } from 'something';

    const addThingToThing = (a, b) a + b;
    ```

=== "Java"

    ```java
    public void function() {
        test();
    }
    ```

```java tab="java"
    public void function() {
      test();
    }
```

```java tab="java 2"
    public void function() {
      test();
    }
```

# MDX truly sane lists

- attributes

- customer
  - first_name
    - test
  - family_name
  - email
- person
  - first_name
  - family_name
  - birth_date
- subscription_id

- request

<!-- prettier-ignore -->
*[MOCDOC]: Mock Documentation
