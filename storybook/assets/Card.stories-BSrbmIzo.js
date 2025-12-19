import{r as y,j as e,a3 as f}from"./iframe-DVMaQ9oH.js";import{c as R}from"./clsx-B-dksMZM.js";import{u as C}from"./useStyles-DYDwdb02.js";import{T as i}from"./Text-BFSMAUIr.js";import"./preload-helper-PPVm8Dsz.js";const H={classNames:{root:"bui-Card",header:"bui-CardHeader",body:"bui-CardBody",footer:"bui-CardFooter"}},g={"bui-Card":"_bui-Card_1t20q_20","bui-CardBody":"_bui-CardBody_1t20q_34","bui-CardHeader":"_bui-CardHeader_1t20q_41","bui-CardFooter":"_bui-CardFooter_1t20q_45"},c=y.forwardRef((o,s)=>{const{classNames:t,cleanedProps:a}=C(H,o),{className:n,...d}=a;return e.jsx("div",{ref:s,className:R(t.root,g[t.root],n),...d})}),p=y.forwardRef((o,s)=>{const{classNames:t,cleanedProps:a}=C(H,o),{className:n,...d}=a;return e.jsx("div",{ref:s,className:R(t.header,g[t.header],n),...d})}),h=y.forwardRef((o,s)=>{const{classNames:t,cleanedProps:a}=C(H,o),{className:n,...d}=a;return e.jsx("div",{ref:s,className:R(t.body,g[t.body],n),...d})}),w=y.forwardRef((o,s)=>{const{classNames:t,cleanedProps:a}=C(H,o),{className:n,...d}=a;return e.jsx("div",{ref:s,className:R(t.footer,g[t.footer],n),...d})});c.__docgenInfo={description:`Card component.

@public`,methods:[],displayName:"Card",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};p.__docgenInfo={description:`CardHeader component.

@public`,methods:[],displayName:"CardHeader",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};h.__docgenInfo={description:`CardBody component.

@public`,methods:[],displayName:"CardBody",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};w.__docgenInfo={description:`CardFooter component.

@public`,methods:[],displayName:"CardFooter",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const j=f.meta({title:"Backstage UI/Card",component:c,subcomponents:{CardHeader:p,CardBody:h,CardFooter:w}}),l=j.story({render:o=>e.jsxs(c,{...o,children:[e.jsx(p,{children:"Header"}),e.jsx(h,{children:"Body"}),e.jsx(w,{children:"Footer"})]})}),u=j.story({args:{style:{width:"300px",height:"200px"}},render:l.input.render}),m=j.story({render:()=>e.jsxs(c,{style:{width:"300px",height:"200px"},children:[e.jsx(p,{children:e.jsx(i,{children:"Header"})}),e.jsxs(h,{children:[e.jsx(i,{children:"This is the first paragraph of a long body text that demonstrates how the Card component handles extensive content. The card should adjust accordingly to display all the text properly while maintaining its structure."}),e.jsx(i,{children:"Here's a second paragraph that adds more content to our card body. Having multiple paragraphs helps to visualize how spacing works within the card component."}),e.jsx(i,{children:"This third paragraph continues to add more text to ensure we have a proper demonstration of a card with significant content. This makes it easier to test scrolling behavior and overall layout when content exceeds the initial view."})]}),e.jsx(w,{children:e.jsx(i,{children:"Footer"})})]})}),r=({children:o})=>e.jsx("div",{style:{height:40,width:"100%",backgroundColor:"var(--bui-gray-3)",display:"flex",alignItems:"center",paddingInline:"var(--bui-space-3)",borderRadius:"var(--bui-radius-2)",fontSize:"var(--bui-font-size-3)",marginBottom:"var(--bui-space-1)"},children:o}),x=j.story({render:()=>e.jsxs(c,{style:{width:"300px",height:"200px"},children:[e.jsx(p,{children:e.jsx(i,{children:"Header"})}),e.jsxs(h,{children:[e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"}),e.jsx(r,{children:"Hello world"})]}),e.jsx(w,{children:e.jsx(i,{children:"Footer"})})]})});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <Card {...args}>
      <CardHeader>Header</CardHeader>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
})`,...l.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    style: {
      width: '300px',
      height: '200px'
    }
  },
  render: Default.input.render
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...x.input.parameters?.docs?.source}}};const _=["Default","CustomSize","WithLongBody","WithListRow"];export{u as CustomSize,l as Default,x as WithListRow,m as WithLongBody,_ as __namedExportsOrder};
