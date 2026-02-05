import{r as R,j as e,p as T}from"./iframe-M9O-K8SB.js";import{c as C}from"./clsx-B-dksMZM.js";import{u as H}from"./useStyles-BRwt6BXn.js";import{T as h}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";const y={classNames:{root:"bui-Card",header:"bui-CardHeader",body:"bui-CardBody",footer:"bui-CardFooter"}},L={"bui-Card":"_bui-Card_1t20q_20","bui-CardBody":"_bui-CardBody_1t20q_34","bui-CardHeader":"_bui-CardHeader_1t20q_41","bui-CardFooter":"_bui-CardFooter_1t20q_45"},w=R.forwardRef((r,i)=>{const{classNames:t,cleanedProps:l}=H(y,r),{className:c,...p}=l;return e.jsx("div",{ref:i,className:C(t.root,L[t.root],c),...p})}),u=R.forwardRef((r,i)=>{const{classNames:t,cleanedProps:l}=H(y,r),{className:c,...p}=l;return e.jsx("div",{ref:i,className:C(t.header,L[t.header],c),...p})}),m=R.forwardRef((r,i)=>{const{classNames:t,cleanedProps:l}=H(y,r),{className:c,...p}=l;return e.jsx("div",{ref:i,className:C(t.body,L[t.body],c),...p})}),x=R.forwardRef((r,i)=>{const{classNames:t,cleanedProps:l}=H(y,r),{className:c,...p}=l;return e.jsx("div",{ref:i,className:C(t.footer,L[t.footer],c),...p})});w.__docgenInfo={description:`Card component.

@public`,methods:[],displayName:"Card",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};u.__docgenInfo={description:`CardHeader component.

@public`,methods:[],displayName:"CardHeader",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};m.__docgenInfo={description:`CardBody component.

@public`,methods:[],displayName:"CardBody",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};x.__docgenInfo={description:`CardFooter component.

@public`,methods:[],displayName:"CardFooter",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const g=T.meta({title:"Backstage UI/Card",component:w,subcomponents:{CardHeader:u,CardBody:m,CardFooter:x}}),a=g.story({render:r=>e.jsxs(w,{...r,children:[e.jsx(u,{children:"Header"}),e.jsx(m,{children:"Body"}),e.jsx(x,{children:"Footer"})]})}),s=a.extend({args:{style:{width:"300px",height:"200px"}}}),n=g.story({render:()=>e.jsxs(w,{style:{width:"300px",height:"200px"},children:[e.jsx(u,{children:e.jsx(h,{children:"Header"})}),e.jsxs(m,{children:[e.jsx(h,{children:"This is the first paragraph of a long body text that demonstrates how the Card component handles extensive content. The card should adjust accordingly to display all the text properly while maintaining its structure."}),e.jsx(h,{children:"Here's a second paragraph that adds more content to our card body. Having multiple paragraphs helps to visualize how spacing works within the card component."}),e.jsx(h,{children:"This third paragraph continues to add more text to ensure we have a proper demonstration of a card with significant content. This makes it easier to test scrolling behavior and overall layout when content exceeds the initial view."})]}),e.jsx(x,{children:e.jsx(h,{children:"Footer"})})]})}),o=({children:r})=>e.jsx("div",{style:{height:40,width:"100%",backgroundColor:"var(--bui-gray-3)",display:"flex",alignItems:"center",paddingInline:"var(--bui-space-3)",borderRadius:"var(--bui-radius-2)",fontSize:"var(--bui-font-size-3)",marginBottom:"var(--bui-space-1)"},children:r}),d=g.story({render:()=>e.jsxs(w,{style:{width:"300px",height:"200px"},children:[e.jsx(u,{children:e.jsx(h,{children:"Header"})}),e.jsxs(m,{children:[e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"}),e.jsx(o,{children:"Hello world"})]}),e.jsx(x,{children:e.jsx(h,{children:"Footer"})})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const Default = () => (
  <Card>
    <CardHeader>Header</CardHeader>
    <CardBody>Body</CardBody>
    <CardFooter>Footer</CardFooter>
  </Card>
);
`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const CustomSize = () => (
  <Card
    style={{
      width: "300px",
      height: "200px",
    }}
  />
);
`,...s.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const WithLongBody = () => (
  <Card style={{ width: "300px", height: "200px" }}>
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
);
`,...n.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const WithListRow = () => (
  <Card style={{ width: "300px", height: "200px" }}>
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
);
`,...d.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <Card {...args}>
      <CardHeader>Header</CardHeader>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
})`,...a.input.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    style: {
      width: '300px',
      height: '200px'
    }
  }
})`,...s.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};const B=["Default","CustomSize","WithLongBody","WithListRow"];export{s as CustomSize,a as Default,d as WithListRow,n as WithLongBody,B as __namedExportsOrder};
