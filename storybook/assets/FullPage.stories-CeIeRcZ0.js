import{r as x,j as e,p as P}from"./iframe-B5eUq3Se.js";import{a as y}from"./useStyles-CRlsW8dG.js";import{c as f}from"./clsx-B-dksMZM.js";import{P as l}from"./PluginHeader-D7P0c1aX.js";import{C as c}from"./Container-OMJtkZI1.js";import{M as T}from"./index-Cz1Ci6GP.js";import{T as n}from"./Text-CGdah0kq.js";import"./preload-helper-PPVm8Dsz.js";import"./Link-DhXKiMuD.js";import"./utils-D-zya2iC.js";import"./useObjectRef-CH2wfUkV.js";import"./useFocusable-B1Zrypyp.js";import"./useLink-Dya6hVxe.js";import"./usePress-oaHysT2Y.js";import"./useFocusRing-BwgTf1EI.js";import"./index-kXp0wd56.js";import"./Tabs-pg0YXkKX.js";import"./SelectionManager-BStmZ_8N.js";import"./useEvent-BJx1ljgf.js";import"./SelectionIndicator-BbD8z6of.js";import"./context-DE73IaZD.js";import"./Hidden-YqmwH8Ck.js";import"./useControlledState-B-3NIUMU.js";import"./useListState-3RRYWmnM.js";import"./animation-JN4M0u_f.js";import"./useLabels-Bni-AqQK.js";import"./useHasTabbableChild-B-Uyv6-s.js";import"./InternalLinkProvider-4vCYfpZG.js";const w={classNames:{root:"bui-FullPage"}},C={"bui-FullPage":"_bui-FullPage_1vdnu_20"},s=x.forwardRef((i,o)=>{const{classNames:h,cleanedProps:m}=y(w,i),{className:g,...b}=m;return e.jsx("main",{ref:o,className:f(h.root,C[h.root],g),...b})});s.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
