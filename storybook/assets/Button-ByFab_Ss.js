import{r as x,j as a}from"./iframe-C6d4amxQ.js";import{c as n}from"./clsx-B-dksMZM.js";import{$ as B,a as b}from"./Button-Db10oUVx.js";import{U as w}from"./index-CYxMMw0t.js";import{u as R}from"./useStyles-C22yXYNB.js";import{B as h,s as l}from"./Button.module-DkEJAzA0.js";import{u as k}from"./useSurface-B8xS8R2h.js";const r=x.forwardRef((i,m)=>{const{classNames:e,dataAttributes:s,cleanedProps:o}=R(h,{size:"small",variant:"primary",...i}),{children:u,className:c,iconStart:d,iconEnd:p,loading:v,onSurface:y,...f}=o,{surface:t}=k({onSurface:y});return a.jsx(B,{className:n(e.root,l[e.root],c),ref:m,isPending:v,...s,...typeof t=="string"?{"data-on-surface":t}:{},...f,children:({isPending:g})=>a.jsxs(a.Fragment,{children:[a.jsxs("span",{className:n(e.content,l[e.content]),children:[d,u,p]}),g&&a.jsx(b,{"aria-label":"Loading",isIndeterminate:!0,className:n(e.spinner,l[e.spinner]),children:a.jsx(w,{"aria-hidden":"true"})})]})})});r.displayName="Button";r.__docgenInfo={description:`A button component built on React Aria Components that provides accessible
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

@public`,methods:[],displayName:"Button",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:`| 'primary'
| 'secondary'
| 'tertiary'
| Partial<Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>>`,elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>"}],raw:"Partial<Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>>"}]},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:""},onSurface:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0'
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
| 'auto'`,elements:[{name:"literal",value:"'0'"},{name:"literal",value:"'1'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"},{name:"literal",value:"'auto'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:"Surface the button is placed on. Defaults to context surface if available"}},composes:["RAButtonProps"]};export{r as B};
