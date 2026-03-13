import{ap as b,r as P,am as x,j as e,p as y}from"./iframe-DvAQ9TL9.js";import{P as l}from"./PluginHeader-CWsW-73B.js";import{C as c}from"./Container-OnqXolMI.js";import{M as f}from"./index-Bpd4QHCD.js";import{T as n}from"./Text-COi90-_w.js";import"./preload-helper-PPVm8Dsz.js";import"./Link-CHwRg-Jy.js";import"./utils-CdcvjRHZ.js";import"./useObjectRef-Ch6vQssw.js";import"./useFocusable-BLqqnbjL.js";import"./useLink-BHoTwmKi.js";import"./usePress-CVvk8a1c.js";import"./useFocusRing-DopupSld.js";import"./index-iC8021-X.js";import"./Tabs-DeJchPEE.js";import"./SelectionManager-qKsa07cO.js";import"./useEvent-CjsBGFhl.js";import"./SelectionIndicator-2mASoSf1.js";import"./context-HtFdpMN0.js";import"./Hidden-C6XFyF_R.js";import"./useControlledState-CJoIqx_4.js";import"./useListState-BsA_lSVz.js";import"./animation-BZiEGXQn.js";import"./useLabels-CE8ep-rH.js";import"./useHasTabbableChild-Dzmc-0YY.js";import"./getNodeText-C1DNavRe.js";const T={"bui-FullPage":"_bui-FullPage_1vdnu_20"},w=b()({styles:T,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),s=P.forwardRef((i,o)=>{const{ownProps:h,restProps:m}=x(w,i),{classes:g}=h;return e.jsx("main",{ref:o,className:g.root,...m})});s.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
