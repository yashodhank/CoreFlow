## Warning
This is a work in progress be patient, things may change, or any parts can break, if you have any of these situations, be free to open an issue.

## CoreFlow
CoreFlow are Business Rules and powered Workflows to frappé framework

### Resources

#### Document Flow

*Document Flow* is a new way to create client and server side scripts, it is based on the concept of **Macros**, that have actions and can have (or not) a restriction rule.
The *Document Flow*, generate a group of scripts that is automatically attached to:

- **DocType Events**
	- Save
	- Cancel
	- Submit
	- Amend
- **Workflow Transitions**
- **Field Changes**
- **Global Actions**
	- Add Filter Condition in a Link field
	- Add the fetch of an value from a linked doctype

![The image of Document Flow]()

#### Expressions

In the same context of **Macros**, *Expressions* is the way of define math functions without code.
This resource have the capability of create code functions to use in the *Equations Editor*, using only `Mathematic` expressions 

## Credits

1. The [frappe team](http://frappe.io) and you big framework
2. @chrisjpowers to create the project [Business Rules](http://github.com/chrisjpowers/business-rules) that is the base of the `Business Rule Engine`
3. @JuniorPolegato to create the gist [calcular_formula.py](https://gist.github.com/JuniorPolegato/9943390) that is the base of the `Equation Solver`
4. @google to create the project [Blockly](https://github.com/google/blockly) that is the base of the `Function Creator` 

## License

The MIT License (MIT)

Copyright (c) 2015 Maxwell Morais and Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.