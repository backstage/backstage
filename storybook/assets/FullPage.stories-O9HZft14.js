import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-BT856zKW.js";import{P as l}from"./PluginHeader-DZuNsuew.js";import{C as p}from"./Container-BeI8m0WA.js";import{T as t}from"./Text-BCHjowwS.js";import{B as j}from"./BUIProvider-ji7JuJVK.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DX-mGHlN.js";import"./utils-CpwCIt4g.js";import"./useObjectRef-C9B7I4dA.js";import"./useCollection-qrRQ7ESK.js";import"./useFocusRing-BT_-10ZK.js";import"./openLink-cidOSJP4.js";import"./Hidden-49UROW8g.js";import"./keyboard-OOu-nIBg.js";import"./FocusScope-C5yn6WOl.js";import"./useEvent-C-5yOyHh.js";import"./I18nProvider-D0MkpVu-.js";import"./usePress-D8DHmOrO.js";import"./textSelection-BbGtchwD.js";import"./useControlledState-B8MFkE-b.js";import"./Link-BjI2rO_A.js";import"./useLink-D5_dqv17.js";import"./useHover-qIfqE_w_.js";import"./useLocalizedStringFormatter-BWCbUYkC.js";import"./Button-C7kwpLvK.js";import"./Label-DWhvkKMc.js";import"./useLabel-4EIIh35K.js";import"./useLabels-mD4IPMLK.js";import"./number-DEPRmkya.js";import"./useButton-BY1LIf6_.js";import"./Menu-BaA0gEdG.js";import"./Autocomplete-BV1G3v_N.js";import"./getItemCount-BjPsHTlG.js";import"./Input-DudLBmfR.js";import"./ListBox-CUKyMzJh.js";import"./Text-76s0V35L.js";import"./useListState-BANuCIhm.js";import"./Dialog-7toW9pgp.js";import"./Heading-CT1W0R0U.js";import"./useOverlayTriggerState-jSPLUxR-.js";import"./VisuallyHidden-DJz9VSfc.js";import"./animation-D-E6JIW4.js";import"./SearchField-CpzWT6VV.js";import"./FieldError-C6e4WYaM.js";import"./useFormValidation-GBXOaCZU.js";import"./useTextField-Dr2g0Wsf.js";import"./useField-BE3cQBfr.js";import"./useFormReset-BqsbtU9Q.js";import"./Virtualizer-BC6dKyiN.js";import"./useFilter-DFTMyblJ.js";import"./getNodeText-CQI00Gmj.js";import"./Link-DbTbUxfI.js";import"./useResolvedHref-D25t_NXC.js";import"./Tooltip-o3hefnT9.js";import"./VisuallyHidden-0P7DfoHG.js";import"./Tabs-DRvPF1s4.js";import"./useHasTabbableChild-WRZ73sqb.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
