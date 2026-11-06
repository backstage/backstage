import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-7FfCsjQc.js";import{P as l}from"./PluginHeader-DaQ9xQrv.js";import{C as p}from"./Container-Dz73gnNT.js";import{T as t}from"./Text-D0MOEFYc.js";import{B as j}from"./BUIProvider-BZyiD9ly.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXkdWngf.js";import"./utils-DkNeRnP6.js";import"./useObjectRef-CsTMWTDw.js";import"./useCollection-Bl5Yq63u.js";import"./useFocusRing-CHKTV0kp.js";import"./openLink-Ce5UoBQT.js";import"./Hidden-DWfTAcXo.js";import"./keyboard-B3r4E7N4.js";import"./getMetaValue-DunJaaKa.js";import"./FocusScope-Dq2-_t9h.js";import"./useEvent-Bzfc_gjv.js";import"./I18nProvider-s8LwHCKO.js";import"./usePress-DKLyQD2V.js";import"./textSelection-D55lhVzK.js";import"./useControlledState-By3FW3bK.js";import"./Link-B0JQupG_.js";import"./useLink-CSwyoZ4g.js";import"./useHover-Br5T7sDg.js";import"./useLocalizedStringFormatter-xBjTaWVb.js";import"./Button-nF4s0KaT.js";import"./Label-CfvtIL-W.js";import"./useLabel-CcTyycKi.js";import"./useLabels-D-zjlwnt.js";import"./number-DWRq-mjd.js";import"./useButton-CTCTOTVx.js";import"./Menu-X_XATpA0.js";import"./Autocomplete-BcfTfzIB.js";import"./useLoadMoreSentinel-BYVQ9RpI.js";import"./Input-DyO4o2aC.js";import"./ListBox-BHVPyL-0.js";import"./SelectionIndicator-CIUewUGj.js";import"./Text-gD4wc_j1.js";import"./useListState-hav0q8Ol.js";import"./Dialog-CTbQt-_b.js";import"./Heading-DIStzqSg.js";import"./useOverlayTriggerState-8g9hD9p5.js";import"./VisuallyHidden-DkHGc8x1.js";import"./animation-Drt1ngHL.js";import"./SearchField-228v7GeR.js";import"./FieldError-DlP5L_Ea.js";import"./Form-qI6nggP9.js";import"./useFormValidation-Bf6DMqH_.js";import"./useTextField-SsEV2ZCG.js";import"./useField-BWh8M6zw.js";import"./useFormReset-CROC2zjd.js";import"./Virtualizer-BGFXljmS.js";import"./useFilter-CDWn9WkE.js";import"./getNodeText-aZWo17IS.js";import"./Link-BajYAiRn.js";import"./useResolvedHref-5zlhPrPS.js";import"./Tooltip-MpmPsIMR.js";import"./VisuallyHidden-DVQCC0em.js";import"./Tabs-CMi4gl0r.js";import"./useHasTabbableChild-BjrrnWLV.js";import"./BUIRoutingProvider-CI4cuRTu.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const _e=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,_e as __namedExportsOrder};
