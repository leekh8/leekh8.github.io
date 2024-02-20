---
categories: [MD]
tags: [MD, grammar, Tags, Mermaid]
img_path: /assets/lib/post-img/
permalink: /assets/lib/code/
---

# Utilization

## Toggles

<details>
  <summary>How to write a toggle</summary>
  <div markdown="1">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </div>
</details>

```html
<details>
  <summary>How to write a toggle</summary>
  <div markdown="1">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </div>
</details>
```

### Blocks with toggles

<details>
  <summary>Install Node.js and NPM</summary>
  <div markdown="1">
    <style>
      #inlineBlock {
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        color: #1f2328;
        background-color: #f6f8fa;
        border-radius: 6px;
      }
    </style>
    1.
    <a href="<https://nodejs.org/en>" target="_blank"
      >Visit the Node.js homepage</a
    ><br/>
    2. Download the LTS version and install it<br/>
    3. Check the downloaded node version on the terminal

    <div id="inlineBlock">$ node -v v14.17.3</div>

  </div>
</details>

```html
<details>
  <summary>Install Node.js and NPM</summary>
  <div markdown="1">
    <style>
      #inlineBlock {
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        color: #1f2328;
        background-color: #f6f8fa;
        border-radius: 6px;
      }
    </style>
    1.
    <a href="<https://nodejs.org/en>" target="_blank"
      >Visit the Node.js homepage</a
    ><br />
    2. Download the LTS version and install it<br />
    3. Check the downloaded node version on the terminal

    <div id="inlineBlock">$ node -v v14.17.3</div>
  </div>
</details>
```

## Open in a new window

[NPM](https://www.npmjs.com/)

[NPM Open in a new window](https://www.npmjs.com/){:target="\_blank"}

<a href="https://www.npmjs.com/" target="_blank">NPM</a>

```md
[NPM](https://www.npmjs.com/)

[NPM Open in a new window](https://www.npmjs.com/){:target="\_blank"}

<!-- HTML version -->

<a href="https://www.npmjs.com/" target="_blank">NPM</a>
```

## Images

<![img-description](1.png){: w="700" h="400" }
_image caption_

{: w="700" h="400" } -> specify the size of the image
{: .left } -> specify the position of the image (left, right)

Setting up YAML headers at the top of the post for image use

```yml
---
img_path: ./assets/lib/post-img/
---
```

## mermaid

Setting up YAML headers at the top of the post for mermaid use

```yml
---
mermaid: true
---
```

## permalink

Setting up YAML headers at the top of the post for permalink use

```yml
---
permalink: /assets/lib/code/
---
```

## Mathematical expressions

Setting up YAML headers at the top of the post for mathematical expressions use

```yml
---
math: true
---
```

## Footnotes

Adding footnotes<sup id="a1">[1](#footnote1)</sup>

```md
Adding footnotes<sup id="a1">[1](#footnote1)</sup>
```

```html
> <b id="footnote1">1</b> Adding footnotes - this is how it's done [↩](#a1)
```

> <b id="footnote1">1</b> Adding footnotes - this is how it's done [↩](#a1)
