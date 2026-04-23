import{ax as x,r as b,u as P,j as e,p as f,M as y}from"./iframe-BkP0WlJq.js";import{P as l}from"./PluginHeader-PLzdFvK8.js";import{C as c}from"./Container-Bi7AZ64B.js";import{T as t}from"./Text-UTxkE-7j.js";import{B as j}from"./BUIProvider-CPBk8mPw.js";import"./preload-helper-PPVm8Dsz.js";import"./index-nUlAPM-b.js";import"./Link-BzLSjHhy.js";import"./useLink-B-5Y-irM.js";import"./useGlobalListeners-BQ7uMXZm.js";import"./useObjectRef-Mf4vhbTH.js";import"./openLink-DB0Ca1x8.js";import"./usePress-C8fD9tc5.js";import"./textSelection-BKZ9NYIi.js";import"./useResolvedHref-B_fCet1Y.js";import"./getNodeText-Ok8NPnTx.js";import"./Tabs-DfjLePKK.js";import"./utils-DHN8Cm_h.js";import"./useCollection-CmpO0ThD.js";import"./Hidden-BXffHnFQ.js";import"./keyboard-D1MAaepU.js";import"./FocusScope-JZzM0yEB.js";import"./useEvent-CwHxOE_a.js";import"./I18nProvider-DmxvoEIH.js";import"./useControlledState-BVQM9Nh9.js";import"./useHasTabbableChild-CoMWHUvG.js";import"./useLabels-B-zEBY3m.js";import"./useListState-Bo3ieulJ.js";import"./animation-X88qEdj0.js";import"./useHover-eAsT_Ppr.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((a,o)=>{const{ownProps:d,restProps:h}=P(T,a),{classes:g}=d;return e.jsx("main",{ref:o,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const p=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),m=a=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(a,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(a,o)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},o)),s=p.story({decorators:[m],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(c,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),i=p.story({decorators:[m],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(c,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),n=p.story({decorators:[m],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(c,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
