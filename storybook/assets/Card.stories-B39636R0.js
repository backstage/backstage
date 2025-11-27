import{r as R,j as e}from"./iframe-B6vHPHUS.js";import{c as C}from"./clsx-B-dksMZM.js";import{u as H}from"./useStyles-C-y3xpyB.js";import{T as i}from"./Text-B-LjbfPX.js";import"./preload-helper-D9Z9MdNV.js";const y={classNames:{root:"bui-Card",header:"bui-CardHeader",body:"bui-CardBody",footer:"bui-CardFooter"}},g={"bui-Card":"_bui-Card_1t20q_20","bui-CardBody":"_bui-CardBody_1t20q_34","bui-CardHeader":"_bui-CardHeader_1t20q_41","bui-CardFooter":"_bui-CardFooter_1t20q_45"},c=R.forwardRef((o,s)=>{const{classNames:t,cleanedProps:a}=H(y,o),{className:d,...n}=a;return e.jsx("div",{ref:s,className:C(t.root,g[t.root],d),...n})}),h=R.forwardRef((o,s)=>{const{classNames:t,cleanedProps:a}=H(y,o),{className:d,...n}=a;return e.jsx("div",{ref:s,className:C(t.header,g[t.header],d),...n})}),p=R.forwardRef((o,s)=>{const{classNames:t,cleanedProps:a}=H(y,o),{className:d,...n}=a;return e.jsx("div",{ref:s,className:C(t.body,g[t.body],d),...n})}),w=R.forwardRef((o,s)=>{const{classNames:t,cleanedProps:a}=H(y,o),{className:d,...n}=a;return e.jsx("div",{ref:s,className:C(t.footer,g[t.footer],d),...n})});c.__docgenInfo={description:`Card component.

@public`,methods:[],displayName:"Card",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};h.__docgenInfo={description:`CardHeader component.

@public`,methods:[],displayName:"CardHeader",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};p.__docgenInfo={description:`CardBody component.

@public`,methods:[],displayName:"CardBody",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};w.__docgenInfo={description:`CardFooter component.

@public`,methods:[],displayName:"CardFooter",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const N={title:"Backstage UI/Card",component:c,subcomponents:{CardHeader:h,CardBody:p,CardFooter:w}},l={render:o=>e.jsxs(c,{...o,children:[e.jsx(h,{children:"Header"}),e.jsx(p,{children:"Body"}),e.jsx(w,{children:"Footer"})]})},x={args:{style:{width:"300px",height:"200px"}},render:l.render},m={render:()=>e.jsxs(c,{style:{width:"300px",height:"200px"},children:[e.jsx(h,{children:e.jsx(i,{children:"Header"})}),e.jsxs(p,{children:[e.jsx(i,{children:"This is the first paragraph of a long body text that demonstrates how the Card component handles extensive content. The card should adjust accordingly to display all the text properly while maintaining its structure."}),e.jsx(i,{children:"Here's a second paragraph that adds more content to our card body. Having multiple paragraphs helps to visualize how spacing works within the card component."}),e.jsx(i,{children:"This third paragraph continues to add more text to ensure we have a proper demonstration of a card with significant content. This makes it easier to test scrolling behavior and overall layout when content exceeds the initial view."})]}),e.jsx(w,{children:e.jsx(i,{children:"Footer"})})]})},r=({children:o})=>e.jsx("div",{style:{height:40,width:"100%",backgroundColor:"var(--bui-gray-3)",display:"flex",alignItems:"center",paddingInline:"var(--bui-space-3)",borderRadius:"var(--bui-radius-2)",fontSize:"var(--bui-font-size-3)",marginBottom:"var(--bui-space-1)"},children:o}),u={render:()=>e.jsxs(c,{style:{width:"300px",height:"200px"},children:[e.jsx(h,{children:e.jsx(i,{children:"Header"})}),e.jsxs(p,{children:[e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"})]}),e.jsx(w,{children:e.jsx(i,{children:"Footer"})})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <Card {...args}>
      <CardHeader>Header</CardHeader>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
}`,...l.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    style: {
      width: '300px',
      height: '200px'
    }
  },
  render: Default.render
}`,...x.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: '300px',
    height: '200px'
  }}>
      <CardHeader>
        <Text>Header</Text>
      </CardHeader>
      <CardBody>
        <Text>
          This is the first paragraph of a long body text that demonstrates how
          the Card component handles extensive content. The card should adjust
          accordingly to display all the text properly while maintaining its
          structure.
        </Text>
        <Text>
          Here's a second paragraph that adds more content to our card body.
          Having multiple paragraphs helps to visualize how spacing works within
          the card component.
        </Text>
        <Text>
          This third paragraph continues to add more text to ensure we have a
          proper demonstration of a card with significant content. This makes it
          easier to test scrolling behavior and overall layout when content
          exceeds the initial view.
        </Text>
      </CardBody>
      <CardFooter>
        <Text>Footer</Text>
      </CardFooter>
    </Card>
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: '300px',
    height: '200px'
  }}>
      <CardHeader>
        <Text>Header</Text>
      </CardHeader>
      <CardBody>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
      </CardBody>
      <CardFooter>
        <Text>Footer</Text>
      </CardFooter>
    </Card>
}`,...u.parameters?.docs?.source}}};const v=["Default","CustomSize","WithLongBody","WithListRow"];export{x as CustomSize,l as Default,u as WithListRow,m as WithLongBody,v as __namedExportsOrder,N as default};
