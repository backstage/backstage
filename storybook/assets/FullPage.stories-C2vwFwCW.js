import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-D690ZVKa.js";import{P as l}from"./PluginHeader-DPKfH0JG.js";import{C as p}from"./Container-GC6TaDUt.js";import{T as t}from"./Text-BbMH-w14.js";import{B as j}from"./BUIProvider-B1wDIoUd.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bm8BO3VD.js";import"./utils-D1ifMOcR.js";import"./useObjectRef-BPqBfMfb.js";import"./useCollection-D-VyboA4.js";import"./useFocusRing-CBblcblV.js";import"./openLink-DlPHZOe9.js";import"./Hidden--Qykx-Ic.js";import"./keyboard-D72E8r4x.js";import"./FocusScope-BcDRs29o.js";import"./useEvent-DY20iqcf.js";import"./I18nProvider-D9TsogMC.js";import"./usePress-BTPot_r7.js";import"./textSelection-30hfHS5F.js";import"./useControlledState-S0N1AjAP.js";import"./Link-DbAQwLFd.js";import"./useLink-IhgWB1B0.js";import"./useHover-Da9hkWGW.js";import"./useLocalizedStringFormatter-ByHr0kaQ.js";import"./Button-DsupNxvN.js";import"./Label-CHMEqKLB.js";import"./useLabel-Bv75J3A8.js";import"./useLabels-D2HAWa9S.js";import"./number-CGXALLEc.js";import"./useButton-D0OzxRTD.js";import"./Menu-Bn28Wq06.js";import"./Autocomplete-BRVeIDCi.js";import"./getItemCount-Bjv4j4sv.js";import"./Input-BcIjPPf8.js";import"./ListBox-DOVlmSgM.js";import"./Text-DseDNxUL.js";import"./useListState-C5Bz0e36.js";import"./Dialog-DVx8D5E7.js";import"./Heading-CqcDwANL.js";import"./useOverlayTriggerState-CBv8lv31.js";import"./VisuallyHidden-DxRh6ZTQ.js";import"./animation-C9FyvRVk.js";import"./SearchField-eliH_CKZ.js";import"./FieldError-Bg2OCVZ8.js";import"./useFormValidation-qsZG3W-8.js";import"./useTextField-CbO3TsY_.js";import"./useField-Ibn97tBU.js";import"./useFormReset-kBO1a2OJ.js";import"./Virtualizer-WsZhLdF6.js";import"./useFilter-CFFLiM5t.js";import"./getNodeText-uOTz8DAP.js";import"./Link-D7-0eHdu.js";import"./useResolvedHref-DuunraQu.js";import"./Tooltip-DRJYQ9XX.js";import"./VisuallyHidden-BSxww6ed.js";import"./Tabs-BcuFUr-r.js";import"./useHasTabbableChild-DFv_tPD-.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
