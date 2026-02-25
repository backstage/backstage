import{r as x,j as e,ap as P,p as y}from"./iframe-DhudO7cT.js";import{u as f}from"./useStyles-u-Ot93UH.js";import{P as l}from"./PluginHeader-CAteNJar.js";import{C as c}from"./Container-DIDpZHGt.js";import{M as T}from"./index-CBf-CADU.js";import{T as n}from"./Text-CO34OvJZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Link-BgNHmYwp.js";import"./utils-Bb3yS_Ab.js";import"./useObjectRef-BysoxMlE.js";import"./useFocusable-DimSR2gn.js";import"./useLink-k8Cvpw1x.js";import"./usePress-DxOfdXQD.js";import"./useFocusRing-CB4rY6aw.js";import"./index-D3F34JDp.js";import"./Tabs-DF6afUqa.js";import"./SelectionManager-Bw0YIyOl.js";import"./useEvent-DjTKB5Vw.js";import"./SelectionIndicator-CMNAKTzY.js";import"./context-BXRp7Dwf.js";import"./Hidden-BoKv9pzF.js";import"./useControlledState-nsorvi3O.js";import"./useListState-DR5EeYw-.js";import"./animation-BuAHP-RJ.js";import"./useLabels-6ktYgEj-.js";import"./useHasTabbableChild-wZkqvq9p.js";import"./InternalLinkProvider-DptaZfo6.js";const w={classNames:{root:"bui-FullPage"}},C={"bui-FullPage":"_bui-FullPage_1vdnu_20"},s=x.forwardRef((i,o)=>{const{classNames:h,cleanedProps:m}=f(w,i),{className:g,...b}=m;return e.jsx("main",{ref:o,className:P(h.root,C[h.root],g),...b})});s.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage"};const u=y.meta({title:"Backstage UI/FullPage",component:s,parameters:{layout:"fullscreen"}}),p=i=>e.jsx(T,{children:e.jsx(i,{})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],d=Array.from({length:20},(i,o)=>e.jsx(n,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},o)),t=u.story({decorators:[p],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(s,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(c,{children:e.jsx(n,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=u.story({decorators:[p],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(s,{children:e.jsxs(c,{children:[e.jsx(n,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(n,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),d]})})]})}),r=u.story({decorators:[p],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(s,{children:e.jsxs(c,{children:[e.jsx(n,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),d]})})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Default = () => (
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
})`,...r.input.parameters?.docs?.source}}};const Z=["Default","WithScrollableContent","WithTabs"];export{t as Default,a as WithScrollableContent,r as WithTabs,Z as __namedExportsOrder};
