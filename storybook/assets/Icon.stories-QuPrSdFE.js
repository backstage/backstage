import{j as e}from"./jsx-runtime-hv06LKfz.js";import{I as a,i as n,b as t}from"./provider-C6Ma5UVL.js";import"./index-D8-PC79C.js";import"./clsx-B-dksMZM.js";import"./useStyles-Dc-DqJ_c.js";const u={title:"Backstage UI/Icon",component:a,argTypes:{name:{control:"select",options:Object.keys(n)}},args:{name:"heart"}},r={args:{name:"heart"}},o={args:{name:"arrow-down"},decorators:[s=>e.jsx(t,{overrides:{"arrow-down":()=>e.jsx("div",{children:"Custom Icon"})},children:e.jsx(s,{})})]};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'heart'
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'arrow-down'
  },
  decorators: [Story => <IconProvider overrides={{
    'arrow-down': () => <div>Custom Icon</div>
  }}>
        <Story />
      </IconProvider>]
}`,...o.parameters?.docs?.source}}};const I=["Default","WithCustomIcon"];export{r as Default,o as WithCustomIcon,I as __namedExportsOrder,u as default};
