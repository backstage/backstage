import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-CIT-dZu_.js";import{T as y}from"./TestRouter-DxyzTFrB.js";import{P as l}from"./PluginHeader-BxEl2AGD.js";import{C as p}from"./Container-DfyVepy1.js";import{T as t}from"./Text-BZ7yrAUT.js";import{B as j}from"./BUIProvider-DvUfRZ9N.js";import"./preload-helper-PPVm8Dsz.js";import"./index-bElBlM3z.js";import"./index-C4qi6jZX.js";import"./utils-3SfRWDXk.js";import"./useObjectRef-B4D9CzQM.js";import"./useCollection-BUaSHk5y.js";import"./useFocusRing-ByVMGaNA.js";import"./Hidden-paCviALj.js";import"./keyboard-BWVXbNVx.js";import"./getMetaValue-SvU3Wp5k.js";import"./FocusScope-BRVILLR6.js";import"./useEvent-NLk_1-hY.js";import"./I18nProvider-CmgCSkj9.js";import"./usePress-BOnalXjM.js";import"./textSelection-aEjP62Wo.js";import"./useControlledState-Bo32Yv4j.js";import"./Link-w0Fuv7hL.js";import"./useLink-_mzc6dOY.js";import"./useHover-tuK_rbDS.js";import"./useLocalizedStringFormatter-Ck0tckSr.js";import"./Button-BzxePFvu.js";import"./Label-BoyMwewe.js";import"./useLabel-Cq-2nnHJ.js";import"./useLabels-BEUaVICg.js";import"./number-BCBVXMPD.js";import"./useButton-B66KWxu2.js";import"./Menu-DhRLi_Ke.js";import"./Autocomplete-NZhbccUZ.js";import"./useLoadMoreSentinel-DzkxUf7S.js";import"./Input-BIjePdm2.js";import"./ListBox-BFhTPBUb.js";import"./SelectionIndicator-tggTf9VM.js";import"./Text-CzkJILey.js";import"./useListState-_Y2jui6D.js";import"./Dialog-I5_bxuwD.js";import"./Heading-xjtrGHLX.js";import"./useOverlayTriggerState-B26sLsFg.js";import"./VisuallyHidden-C5NMUpy-.js";import"./animation-pATfZ50U.js";import"./SearchField-BRGZJJx-.js";import"./FieldError-o5djUeGf.js";import"./Form-bWXWc4sj.js";import"./useFormValidation-oa4sjkgN.js";import"./useTextField-DpnlZvWg.js";import"./useField-CyrTSk-V.js";import"./useFormReset-BxKhZo52.js";import"./Virtualizer-CmpyEeJG.js";import"./useFilter-BbOUNcGe.js";import"./getNodeText-Ccf25D0P.js";import"./BUIRoutingProvider-6gcgcyzR.js";import"./Link-uW6QcpYF.js";import"./Tooltip-2dCQur-O.js";import"./VisuallyHidden-CBhFPefq.js";import"./Tabs-CaccTjX1.js";import"./useHasTabbableChild-DjPEoogC.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=P.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const qe=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,qe as __namedExportsOrder};
