import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-DQtIir6_.js";import{P as l}from"./PluginHeader-DeB0XL-F.js";import{C as p}from"./Container-B0XgB-o6.js";import{T as t}from"./Text-B6ISVKHE.js";import{B as j}from"./BUIProvider-BFppeoJz.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DAbm8TV7.js";import"./utils-Bxehr4HY.js";import"./useObjectRef-DXWxL9lA.js";import"./useCollection-DgHWP1O0.js";import"./useFocusRing-C5ZfLx-L.js";import"./openLink-DLb8P_7j.js";import"./Hidden-BXNE10bz.js";import"./keyboard-CcRtsJxd.js";import"./FocusScope-BBiWJUPZ.js";import"./useEvent-CfByOP8u.js";import"./I18nProvider-DPDmyrTN.js";import"./usePress-T3jvNl8O.js";import"./textSelection-Nrcy7rMY.js";import"./useControlledState-DM-B3g3-.js";import"./Link-BguY1hCw.js";import"./useLink-C2jx_QQ-.js";import"./useHover-Dsk-KXl4.js";import"./useLocalizedStringFormatter-DGn_4eCR.js";import"./Button-hU1qrjNo.js";import"./Label-CAcSZgVu.js";import"./useLabel-mAp9Q6tE.js";import"./useLabels-DLIlGtBk.js";import"./number-CQw8CDov.js";import"./useButton-yvh0BHKl.js";import"./Menu-DgwMA5HY.js";import"./Autocomplete-CbdvlYso.js";import"./getItemCount-CVX00gh7.js";import"./Input-DhaMJBF2.js";import"./ListBox-CL87kPUx.js";import"./Text-C6rkAhiv.js";import"./useListState-BnLB_jOB.js";import"./Dialog-7WeMafGQ.js";import"./Heading-BHHcqdTe.js";import"./useOverlayTriggerState-BR5G58Ql.js";import"./VisuallyHidden-CmFx4Hen.js";import"./animation-BlVyC_Be.js";import"./SearchField-BYdwdggT.js";import"./FieldError-X1ho85_q.js";import"./useFormValidation-CcujdjyJ.js";import"./useTextField-fgQA1ZSg.js";import"./useField-X2MxXqm2.js";import"./useFormReset-BmTewx61.js";import"./Virtualizer-jJxeYzGB.js";import"./useFilter-CKsTtfCn.js";import"./getNodeText-lXATV8-K.js";import"./Link-D8XMErqO.js";import"./useResolvedHref-DS33idVI.js";import"./Tooltip-zNdaS_lN.js";import"./VisuallyHidden-DwyzoOvI.js";import"./Tabs-CPIYZYTS.js";import"./useHasTabbableChild-DNqj_c83.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
