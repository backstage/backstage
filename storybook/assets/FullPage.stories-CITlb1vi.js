import{r as x,j as e,p as P}from"./iframe-DHcBEgBH.js";import{a as y}from"./useStyles--IRSF0A9.js";import{c as f}from"./clsx-B-dksMZM.js";import{P as l}from"./PluginHeader-d6aFVO-D.js";import{C as c}from"./Container-vCbkXn6n.js";import{M as T}from"./index-CAQ8RYn7.js";import{T as n}from"./Text-B9ylEj7I.js";import"./preload-helper-PPVm8Dsz.js";import"./Link-0-L3FiB3.js";import"./utils-CkMQMLOq.js";import"./useObjectRef-BvIRJy6b.js";import"./useFocusable-PYCxToJD.js";import"./useLink-CcKBWd_2.js";import"./usePress-BMfi2b4b.js";import"./useFocusRing-DcpHIXiz.js";import"./index-DBQbpShW.js";import"./Tabs-BKXK1bSV.js";import"./SelectionManager-BbRpxvys.js";import"./useEvent-BNhXb7r6.js";import"./SelectionIndicator-DmUUHkwZ.js";import"./context-CqU1AwNo.js";import"./Hidden-BetxpJ4E.js";import"./useControlledState-CeIx9NLz.js";import"./useListState-BLpyj2kB.js";import"./animation-DYYXht0S.js";import"./useLabels-B0PJNwOY.js";import"./useHasTabbableChild-BJlOdZGM.js";import"./InternalLinkProvider-HaiAlc-p.js";const w={classNames:{root:"bui-FullPage"}},C={"bui-FullPage":"_bui-FullPage_1vdnu_20"},s=x.forwardRef((i,o)=>{const{classNames:h,cleanedProps:m}=y(w,i),{className:g,...b}=m;return e.jsx("main",{ref:o,className:f(h.root,C[h.root],g),...b})});s.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage"};const u=P.meta({title:"Backstage UI/FullPage",component:s,parameters:{layout:"fullscreen"}}),p=i=>e.jsx(T,{children:e.jsx(i,{})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],d=Array.from({length:20},(i,o)=>e.jsx(n,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},o)),t=u.story({decorators:[p],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(s,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(c,{children:e.jsx(n,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),r=u.story({decorators:[p],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(s,{children:e.jsxs(c,{children:[e.jsx(n,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(n,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),d]})})]})}),a=u.story({decorators:[p],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(s,{children:e.jsxs(c,{children:[e.jsx(n,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),d]})})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Default = () => (
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
`,...t.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithScrollableContent = () => (
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
`,...r.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const WithTabs = () => (
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
`,...a.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...r.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const $=["Default","WithScrollableContent","WithTabs"];export{t as Default,r as WithScrollableContent,a as WithTabs,$ as __namedExportsOrder};
