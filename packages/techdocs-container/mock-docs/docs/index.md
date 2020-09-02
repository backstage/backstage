## hello mock docs

!!! test
Testing somethin

Some text about MOCDOC

\*[MOCDOC]: Mock Documentation

This is a paragraph.
{: #test_id .test_class }

Apple
: Pomaceous fruit of plants of the genus Malus in
the family Rosaceae.

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

# The attack plan

{% dot attack_plan.svg
    digraph G {
        rankdir=LR
        Earth [peripheries=2]
        Mars
        Earth -> Mars
    }
%}

```graphviz dot attack_plan.svg
digraph G {
    rankdir=LR
    Earth [peripheries=2]
    Mars
    Earth -> Mars
}
```

# PlantUML Samples

```plantuml classes="uml myDiagram" alt="Diagram placeholder" title="My diagram"
@startuml
  Goofy ->  MickeyMouse: calls
  Goofy <-- MickeyMouse: responds
@enduml
```
