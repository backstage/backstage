import{bg as d,ca as m,cH as u,bR as e,h as g,i as h}from"./iframe-Bm5ba6Eo.js";import{b as f}from"./useObjectRef--OGAdRX4.js";import{b as x}from"./useOverlayTriggerState-TZO6sVsq.js";import{g as b}from"./Dialog-B2nmK5qO.js";const v={"bui-Popover":"_bui-Popover_yzy91_20","bui-PopoverArrow":"_bui-PopoverArrow_yzy91_44","bui-PopoverContent":"_bui-PopoverContent_yzy91_74"},w=d()({styles:v,classNames:{root:"bui-Popover",arrow:"bui-PopoverArrow",content:"bui-PopoverContent"},propDefs:{children:{},hideArrow:{},className:{}}}),r=m.forwardRef((i,a)=>{const{ownProps:s,restProps:p}=u(w,i),{classes:o,children:l,hideArrow:c}=s,n=f();return e.jsx(b,{className:o.root,...p,ref:a,children:({trigger:t})=>e.jsxs(e.Fragment,{children:[!c&&t!=="MenuTrigger"&&t!=="SubmenuTrigger"&&e.jsx(x,{className:o.arrow,children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[e.jsx("defs",{children:e.jsx("path",{id:n,fillRule:"evenodd",d:"M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})}),e.jsx("use",{href:`#${n}`}),e.jsx("use",{href:`#${n}`}),e.jsx("path",{d:"M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})]})}),e.jsx(g,{children:e.jsx(h,{bg:"neutral",className:o.content,children:l})})]})})});r.displayName="Popover";r.__docgenInfo={description:`A popover component built on React Aria Components that displays floating
content anchored to a trigger element.

@remarks
The Popover component supports multiple placements (top, right, bottom, left),
automatic viewport-constrained scrolling, and conditional arrow rendering. It
automatically handles positioning, collision detection, and ARIA attributes for
accessibility. Content is automatically padded and scrollable when it exceeds
available space.

@example
Basic usage with DialogTrigger:
\`\`\`tsx
<DialogTrigger>
  <Button>Open Popover</Button>
  <Popover>
    <Text>Popover content</Text>
  </Popover>
</DialogTrigger>
\`\`\`

@example
With custom placement and no arrow:
\`\`\`tsx
<DialogTrigger>
  <Button>Open</Button>
  <Popover placement="right" hideArrow>
    <Text>Content without arrow</Text>
  </Popover>
</DialogTrigger>
\`\`\`

@public`,methods:[],displayName:"Popover",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:`The content to display inside the popover.
Content is automatically wrapped with padding and scroll behavior.`},hideArrow:{required:!1,tsType:{name:"boolean"},description:`Whether to hide the arrow pointing to the trigger element.
Arrow is also automatically hidden for MenuTrigger and SubmenuTrigger contexts.

@defaultValue false`},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};export{r as P};
