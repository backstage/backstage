import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-81VbGqYS.js";import{T as y}from"./TestRouter-mD7dv3Pk.js";import{P as l}from"./PluginHeader-spfdI8Pb.js";import{C as p}from"./Container-D7pMjzQb.js";import{T as t}from"./Text-YsoifKm_.js";import{B as j}from"./BUIProvider-E8WhSxx6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BTbib15M.js";import"./index-CoR4Ep33.js";import"./utils-Bc3qSy6a.js";import"./useObjectRef-CnOD3daG.js";import"./useCollection-CQ5WrmA1.js";import"./useFocusRing-DYHYlv_4.js";import"./Hidden-Cb1mFWSL.js";import"./keyboard-CCO2TRC1.js";import"./getMetaValue-CCa-nVAs.js";import"./FocusScope-DDyHpiBa.js";import"./useEvent-BH0muyj4.js";import"./I18nProvider-DxzKOluv.js";import"./usePress-Ck2OcU07.js";import"./textSelection-Dc2ic2y7.js";import"./useControlledState-DitDneEU.js";import"./Link-D0lufri3.js";import"./useLink-CYC075cg.js";import"./useHover-BliW0Nnt.js";import"./useLocalizedStringFormatter-CCFWdnVn.js";import"./Button-C-RbpSFH.js";import"./Label-Dd3OarLH.js";import"./useLabel-DNA1h8U7.js";import"./useLabels-DvwPDbuz.js";import"./number-CXfm_f_X.js";import"./useButton-D4MYDvTL.js";import"./Menu-Bi3KmNIt.js";import"./Autocomplete-DwtsJgQQ.js";import"./useLoadMoreSentinel-BHThIPjI.js";import"./Input-D4Umh9QE.js";import"./ListBox-C20e-ujn.js";import"./SelectionIndicator-BKJhibyF.js";import"./Text-Dwv53_8C.js";import"./useListState-CNgw0_PC.js";import"./Dialog-YrzWagd5.js";import"./Heading-CoXsiMEk.js";import"./useOverlayTriggerState-CQqx4yUK.js";import"./VisuallyHidden-DRGpg-Tu.js";import"./animation-DeGzi18H.js";import"./SearchField-ESIovKsa.js";import"./FieldError-ptcf45Tc.js";import"./Form-BW2R70vK.js";import"./useFormValidation-iCx97y-U.js";import"./useTextField-B6wfEo-c.js";import"./useField-C1N2YRai.js";import"./useFormReset-BBjLEm68.js";import"./Virtualizer-CTr4aw9n.js";import"./useFilter-B2Yw2vQL.js";import"./getNodeText-_cKwjCAI.js";import"./BUIRoutingProvider-DmskIIHn.js";import"./Link-x-sCiAJh.js";import"./Tooltip-C6UWXmVf.js";import"./VisuallyHidden-SZM5pvAx.js";import"./Tabs-DjEfhQUz.js";import"./useHasTabbableChild-Bb85bpql.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
