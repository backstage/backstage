import{ax as x,r as b,f,j as e,p as P,M as y}from"./iframe-BCuiGO18.js";import{P as l}from"./PluginHeader-ldjJXQTk.js";import{C as c}from"./Container-B9jbcsK4.js";import{T as t}from"./Text-DMbKVHIB.js";import{B as j}from"./BUIProvider-DVdVOrKl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CZoZdV61.js";import"./Link-Ch47eojL.js";import"./useFocusRing-DLmUbRy9.js";import"./useObjectRef-4ckOICrI.js";import"./openLink-qumaaci0.js";import"./useLink-Drk5Ft_h.js";import"./usePress-BvVw0-yf.js";import"./textSelection-B2Nn6fLe.js";import"./useResolvedHref-BM9nXUlO.js";import"./getNodeText-CMopUeQo.js";import"./Tabs-BwvPx4_E.js";import"./utils-Dk-My0Vp.js";import"./useCollection-BFYgTRUF.js";import"./Hidden-CQxh535z.js";import"./keyboard-CW4oFFyD.js";import"./FocusScope-C9frp5S3.js";import"./useEvent-4on_clb_.js";import"./I18nProvider-PVYTewA5.js";import"./useControlledState-BCKq2N8L.js";import"./useHasTabbableChild-BsIxHqfb.js";import"./useLabels-DNIhmQLC.js";import"./useListState-CxjrO4Uy.js";import"./animation-G_BOhArD.js";import"./useHover-DAnXmX41.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((a,o)=>{const{ownProps:d,restProps:h}=f(T,a),{classes:g}=d;return e.jsx("main",{ref:o,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const p=P.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),m=a=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(a,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(a,o)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},o)),s=p.story({decorators:[m],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(c,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),i=p.story({decorators:[m],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(c,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),n=p.story({decorators:[m],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(c,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...i.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};const te=["Default","WithScrollableContent","WithTabs"];export{s as Default,i as WithScrollableContent,n as WithTabs,te as __namedExportsOrder};
