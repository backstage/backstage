import{ap as b,r as P,am as x,j as e,p as y}from"./iframe-CMBqt-A6.js";import{P as l}from"./PluginHeader-DqpBD4Ui.js";import{C as c}from"./Container-BKfdg_pe.js";import{M as f}from"./index-9jpoN6B7.js";import{T as n}from"./Text-BgeSLHUM.js";import"./preload-helper-PPVm8Dsz.js";import"./Link-CtHDVGGg.js";import"./utils-BsuA5P8E.js";import"./useObjectRef-CGSD8NQp.js";import"./useFocusable-CV7yW7DE.js";import"./useLink-BS3j-5Ug.js";import"./usePress-JKpwaxPV.js";import"./useFocusRing-Dg5qN7f3.js";import"./index-CeouwpqU.js";import"./Tabs-EkPersio.js";import"./SelectionManager-fq9uxR9W.js";import"./useEvent-LJhgLKkp.js";import"./SelectionIndicator-CEoz0uol.js";import"./context-CjP_Id4P.js";import"./Hidden-Cum0__DP.js";import"./useControlledState-Bi1RpUJn.js";import"./useListState-B7Wd3gnW.js";import"./animation-Bx-ue73j.js";import"./useLabels-D3b8Bz8f.js";import"./useHasTabbableChild-BLPRaqsf.js";import"./InternalLinkProvider-B0CHN5k4.js";const T={"bui-FullPage":"_bui-FullPage_1vdnu_20"},w=b()({styles:T,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),s=P.forwardRef((i,o)=>{const{ownProps:h,restProps:m}=x(w,i),{classes:g}=h;return e.jsx("main",{ref:o,className:g.root,...m})});s.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const p=y.meta({title:"Backstage UI/FullPage",component:s,parameters:{layout:"fullscreen"}}),u=i=>e.jsx(f,{children:e.jsx(i,{})}),C=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],d=Array.from({length:20},(i,o)=>e.jsx(n,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},o)),t=p.story({decorators:[u],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(s,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(c,{children:e.jsx(n,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=p.story({decorators:[u],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(s,{children:e.jsxs(c,{children:[e.jsx(n,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(n,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),d]})})]})}),r=p.story({decorators:[u],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:C}),e.jsx(s,{children:e.jsxs(c,{children:[e.jsx(n,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),d]})})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Default = () => (
  <>
    <PluginHeader title="My Plugin" />
    <FullPage style={{ backgroundColor: "#c3f0ff" }}>
      <Container>
        <Text as="p">
          This content fills the remaining viewport height below the Header.
        </Text>
      </Container>
    </FullPage>
  </>
);
`,...t.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const WithScrollableContent = () => (
  <>
    <PluginHeader title="My Plugin" />
    <FullPage>
      <Container>
        <Text as="h2" variant="title-medium">
          Scrollable Content
        </Text>
        <Text as="p">
          The content below scrolls independently while the Header stays pinned
          at the top.
        </Text>
        {paragraphs}
      </Container>
    </FullPage>
  </>
);
`,...a.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithTabs = () => (
  <>
    <PluginHeader title="My Plugin" tabs={tabs} />
    <FullPage>
      <Container>
        <Text as="p">
          The FullPage height adjusts automatically when the Header includes
          tabs, thanks to the ResizeObserver measuring the Header's actual
          height.
        </Text>
        {paragraphs}
      </Container>
    </FullPage>
  </>
);
`,...r.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...t.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...r.input.parameters?.docs?.source}}};const X=["Default","WithScrollableContent","WithTabs"];export{t as Default,a as WithScrollableContent,r as WithTabs,X as __namedExportsOrder};
