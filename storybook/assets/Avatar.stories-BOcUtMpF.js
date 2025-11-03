import{r as p,j as e}from"./iframe-B1bS8kNu.js";import{c as g}from"./clsx-B-dksMZM.js";import{u as z}from"./useStyles-CdqC6JSo.js";import{F as i}from"./Flex-BXqCaKuJ.js";import{T as o}from"./Text-CY-xFuS6.js";import"./preload-helper-D9Z9MdNV.js";const v={"bui-AvatarRoot":"_bui-AvatarRoot_1vkm4_20","bui-AvatarImage":"_bui-AvatarImage_1vkm4_62","bui-AvatarFallback":"_bui-AvatarFallback_1vkm4_69"},r=p.forwardRef((a,A)=>{const{classNames:t,dataAttributes:h,cleanedProps:j}=z("Avatar",{size:"medium",purpose:"informative",...a}),{className:b,src:d,name:x,purpose:f,...F}=j,[y,u]=p.useState("loading");p.useEffect(()=>{u("loading");const s=new Image;return s.onload=()=>u("loaded"),s.onerror=()=>u("error"),s.src=d,()=>{s.onload=null,s.onerror=null}},[d]);const T=x.split(" ").map(s=>s[0]).join("").toLocaleUpperCase("en-US").slice(0,2);return e.jsx("div",{ref:A,role:"img","aria-label":f==="informative"?x:void 0,"aria-hidden":f==="decoration"?!0:void 0,className:g(t.root,v[t.root],b),...h,...F,children:y==="loaded"?e.jsx("img",{src:d,alt:"",className:g(t.image,v[t.image])}):e.jsx("div",{"aria-hidden":"true",className:g(t.fallback,v[t.fallback]),children:T})})});r.displayName="Avatar";r.__docgenInfo={description:"@public",methods:[],displayName:"Avatar",props:{src:{required:!0,tsType:{name:"string"},description:"URL of the image to display"},name:{required:!0,tsType:{name:"string"},description:"Name of the person - used for generating initials and accessibility labels"},size:{required:!1,tsType:{name:"union",raw:"'x-small' | 'small' | 'medium' | 'large' | 'x-large'",elements:[{name:"literal",value:"'x-small'"},{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"literal",value:"'large'"},{name:"literal",value:"'x-large'"}]},description:`Size of the avatar
@defaultValue 'medium'`},purpose:{required:!1,tsType:{name:"union",raw:"'decoration' | 'informative'",elements:[{name:"literal",value:"'decoration'"},{name:"literal",value:"'informative'"}]},description:`Determines how the avatar is presented to assistive technologies.
- 'informative': Avatar is announced as "\\{name\\}" to screen readers
- 'decoration': Avatar is hidden from screen readers (use when name appears in adjacent text)
@defaultValue 'informative'`}}};const N={title:"Backstage UI/Avatar",component:r},n={args:{src:"https://avatars.githubusercontent.com/u/1540635?v=4",name:"Charles de Dreuille"}},l={args:{...n.args,src:"https://avatars.githubusercontent.com/u/15406AAAAAAAAA"}},m={args:{...n.args},render:a=>e.jsxs(i,{children:[e.jsx(r,{...a,size:"x-small"}),e.jsx(r,{...a,size:"small"}),e.jsx(r,{...a,size:"medium"}),e.jsx(r,{...a,size:"large"}),e.jsx(r,{...a,size:"x-large"})]})},c={args:{...n.args},render:a=>e.jsxs(i,{direction:"column",gap:"4",children:[e.jsxs(i,{direction:"column",gap:"1",children:[e.jsx(o,{variant:"title-x-small",children:"Informative (default)"}),e.jsxs(o,{variant:"body-medium",children:['Use when avatar appears alone. Announced as "',a.name,'" to screen readers:']}),e.jsx(i,{gap:"2",align:"center",children:e.jsx(r,{...a,purpose:"informative"})})]}),e.jsxs(i,{direction:"column",gap:"1",children:[e.jsx(o,{variant:"title-x-small",children:"Decoration"}),e.jsx(o,{variant:"body-medium",children:"Use when name appears adjacent to avatar. Hidden from screen readers to avoid redundancy:"}),e.jsxs(i,{gap:"2",align:"center",children:[e.jsx(r,{...a,purpose:"decoration"}),e.jsx(o,{children:a.name})]})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://avatars.githubusercontent.com/u/1540635?v=4',
    name: 'Charles de Dreuille'
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    src: 'https://avatars.githubusercontent.com/u/15406AAAAAAAAA'
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <Flex>
      <Avatar {...args} size="x-small" />
      <Avatar {...args} size="small" />
      <Avatar {...args} size="medium" />
      <Avatar {...args} size="large" />
      <Avatar {...args} size="x-large" />
    </Flex>
}`,...m.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <Flex direction="column" gap="4">
      <Flex direction="column" gap="1">
        <Text variant="title-x-small">Informative (default)</Text>
        <Text variant="body-medium">
          Use when avatar appears alone. Announced as "{args.name}" to screen
          readers:
        </Text>
        <Flex gap="2" align="center">
          <Avatar {...args} purpose="informative" />
        </Flex>
      </Flex>
      <Flex direction="column" gap="1">
        <Text variant="title-x-small">Decoration</Text>
        <Text variant="body-medium">
          Use when name appears adjacent to avatar. Hidden from screen readers
          to avoid redundancy:
        </Text>
        <Flex gap="2" align="center">
          <Avatar {...args} purpose="decoration" />
          <Text>{args.name}</Text>
        </Flex>
      </Flex>
    </Flex>
}`,...c.parameters?.docs?.source}}};const U=["Default","Fallback","Sizes","Purpose"];export{n as Default,l as Fallback,c as Purpose,m as Sizes,U as __namedExportsOrder,N as default};
