import{aw as x,r as b,au as P,j as e,p as f,M as y}from"./iframe-Cz6SWQVH.js";import{P as l}from"./PluginHeader-B3EYrl7h.js";import{C as c}from"./Container-CTpegvtF.js";import{T as t}from"./Text-tYPEUn0s.js";import{B as j}from"./BUIProvider-C-bV_KZY.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B8gNhpoB.js";import"./Link-DnGcHR1d.js";import"./useLink-DCpBATML.js";import"./useGlobalListeners-_pWc5lzW.js";import"./useObjectRef-B1XDxt8o.js";import"./openLink-yrE7vS55.js";import"./usePress-BeBtVFaO.js";import"./textSelection-CYg68ItS.js";import"./getNodeText-8mXZv5Ta.js";import"./Tabs-D7SHiAVc.js";import"./utils-DdYDv1my.js";import"./useCollection-CLMIp0SM.js";import"./Hidden-DyqXWYJG.js";import"./keyboard-DV3FDKrT.js";import"./FocusScope-BV-ICilT.js";import"./useEvent-Clq4kWZo.js";import"./I18nProvider-ChnkasvC.js";import"./useControlledState-DIn6soyg.js";import"./useHasTabbableChild-D26n1wXV.js";import"./useLabels-CCt0vcrF.js";import"./useListState-ryLfoNuF.js";import"./animation-BcNqkzOv.js";import"./useHover-LSx6rYV4.js";import"./linkUtils-tKDL5Jm1.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((a,o)=>{const{ownProps:d,restProps:h}=P(T,a),{classes:g}=d;return e.jsx("main",{ref:o,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
