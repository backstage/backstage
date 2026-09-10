import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-B771vieD.js";import{P as l}from"./PluginHeader-DVNpcuAl.js";import{C as p}from"./Container-B0Wf4HN3.js";import{T as t}from"./Text-B84F5tk6.js";import{B as j}from"./BUIProvider-Bo_MB1ar.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DGRdaIIA.js";import"./utils-piiChbE4.js";import"./useObjectRef-B_q1TfVk.js";import"./useCollection-3GzdWbYl.js";import"./useFocusRing-C2ykLkBs.js";import"./openLink-AzCo47yl.js";import"./Hidden-DiCVpsT2.js";import"./keyboard-SkeTI-tm.js";import"./FocusScope-BjGHNLEJ.js";import"./useEvent-C9lgzcbu.js";import"./I18nProvider-B3qRoePR.js";import"./usePress-CNqwnYXg.js";import"./textSelection-Dajp4U4D.js";import"./useControlledState-xxmVxo9Z.js";import"./Link-DhFZDmgQ.js";import"./useLink-DKz5IHJJ.js";import"./useHover-B_jF8Yhh.js";import"./useLocalizedStringFormatter-N3j0wPvB.js";import"./Button-B8TxKSC7.js";import"./Label-CJhGoTGL.js";import"./useLabel-CXc7CDh8.js";import"./useLabels-2XgX8oa0.js";import"./number-b5ov0AaU.js";import"./useButton-CAudcQRr.js";import"./Menu-DQgze9NA.js";import"./Autocomplete-C4yaEcL8.js";import"./getItemCount-Bmtj2mYU.js";import"./Input-C9mt94Bx.js";import"./ListBox-CfU-TpSf.js";import"./Text-C7Zn0WpC.js";import"./useListState-DEdI56Mv.js";import"./Dialog-D7n49PW9.js";import"./Heading-COYTGuuZ.js";import"./useOverlayTriggerState-e3hiHQi-.js";import"./VisuallyHidden-C0TN364h.js";import"./animation-CfBUvVtR.js";import"./SearchField-DZNM_RUF.js";import"./FieldError-3yynpqf_.js";import"./useFormValidation-9u5BPFfE.js";import"./useTextField-ta8DG0m3.js";import"./useField-BIaMG0YS.js";import"./useFormReset-BE1g8HWI.js";import"./Virtualizer-CQ_Q188i.js";import"./useFilter-4Dlsunnw.js";import"./getNodeText--zLQaizC.js";import"./Link-DyHyt0h9.js";import"./useResolvedHref-N95SPT_C.js";import"./Tooltip-X4bjTRJ1.js";import"./VisuallyHidden-DC5vvprQ.js";import"./Tabs-xowPBTxR.js";import"./useHasTabbableChild-D9QdqLEY.js";import"./BUIRoutingProvider-CA0Vr8wC.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
