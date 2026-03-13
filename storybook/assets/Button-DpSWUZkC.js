import{ap as p,r as b,am as v,j as e}from"./iframe-C-coJuUP.js";import{$ as y,a as f}from"./Button-HgcBqqAF.js";import{f as B}from"./index-l0R7Uc5Q.js";const g={"bui-Button":"_bui-Button_85crd_20","bui-ButtonContent":"_bui-ButtonContent_85crd_262","bui-ButtonSpinner":"_bui-ButtonSpinner_85crd_276","bui-spin":"_bui-spin_85crd_1"},x=p()({styles:g,classNames:{root:"bui-Button",content:"bui-ButtonContent",spinner:"bui-ButtonSpinner"},bg:"consumer",propDefs:{size:{dataAttribute:!0,default:"small"},variant:{dataAttribute:!0,default:"primary"},destructive:{dataAttribute:!0},loading:{dataAttribute:!0},iconStart:{},iconEnd:{},children:{},className:{}}}),n=b.forwardRef((t,i)=>{const{ownProps:r,restProps:l,dataAttributes:s}=v(x,t),{classes:a,iconStart:o,iconEnd:m,loading:u,children:d}=r;return e.jsx(y,{className:a.root,ref:i,isPending:u,...s,...l,children:({isPending:c})=>e.jsxs(e.Fragment,{children:[e.jsxs("span",{className:a.content,children:[o,d,m]}),c&&e.jsx(f,{"aria-label":"Loading",isIndeterminate:!0,className:a.spinner,children:e.jsx(B,{"aria-hidden":"true"})})]})})});n.displayName="Button";n.__docgenInfo={description:`A button component built on React Aria Components that provides accessible
interactive elements for triggering actions.

@remarks
The Button component supports multiple variants (primary, secondary, tertiary, danger),
sizes (small, medium), and states including loading and disabled. It automatically
handles keyboard navigation, focus management, and ARIA attributes for accessibility.

@example
Basic usage:
\`\`\`tsx
<Button>Click me</Button>
\`\`\`

@example
With icons and loading state:
\`\`\`tsx
<Button
  variant="primary"
  size="medium"
  iconStart={<IconComponent />}
  loading={isSubmitting}
>
  Submit
</Button>
\`\`\`

@public`,methods:[],displayName:"Button",props:{size:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},destructive:{required:!1,tsType:{name:"boolean"},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};export{n as B};
