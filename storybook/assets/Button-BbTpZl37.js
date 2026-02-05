import{r as p,j as e}from"./iframe-M9O-K8SB.js";import{$ as v,a as b}from"./Button-Dkbd3KcU.js";import{f}from"./index-BKJKY9Wv.js";import{d as y,u as g}from"./defineComponent-BmABoWOu.js";const B={"bui-Button":"_bui-Button_142o5_20","bui-ButtonContent":"_bui-ButtonContent_142o5_262","bui-ButtonSpinner":"_bui-ButtonSpinner_142o5_276","bui-spin":"_bui-spin_142o5_1"},x=y()({styles:B,classNames:{root:"bui-Button",content:"bui-ButtonContent",spinner:"bui-ButtonSpinner"},surface:"leaf",propDefs:{size:{dataAttribute:!0,default:"small"},variant:{dataAttribute:!0,default:"primary"},destructive:{dataAttribute:!0},loading:{dataAttribute:!0},iconStart:{},iconEnd:{},onSurface:{},children:{},className:{},style:{}}}),n=p.forwardRef((t,i)=>{const{ownProps:l,restProps:r,dataAttributes:s}=g(x,t),{classes:a,iconStart:m,iconEnd:o,loading:u,children:d}=l;return e.jsx(v,{className:a.root,ref:i,isPending:u,...s,...r,children:({isPending:c})=>e.jsxs(e.Fragment,{children:[e.jsxs("span",{className:a.content,children:[m,d,o]}),c&&e.jsx(b,{"aria-label":"Loading",isIndeterminate:!0,className:a.spinner,children:e.jsx(f,{"aria-hidden":"true"})})]})})});n.displayName="Button";n.__docgenInfo={description:`A button component built on React Aria Components that provides accessible
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

@public`,methods:[],displayName:"Button",props:{onSurface:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0'
| '1'
| '2'
| '3'
| 'danger'
| 'warning'
| 'success'
| 'auto'`,elements:[{name:"literal",value:"'0'"},{name:"literal",value:"'1'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"},{name:"literal",value:"'auto'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:`| '0'
| '1'
| '2'
| '3'
| 'danger'
| 'warning'
| 'success'
| 'auto'`,elements:[{name:"literal",value:"'0'"},{name:"literal",value:"'1'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"},{name:"literal",value:"'auto'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},size:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},destructive:{required:!1,tsType:{name:"boolean"},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"CSSProperties"},description:""}},composes:["Omit"]};export{n as B};
