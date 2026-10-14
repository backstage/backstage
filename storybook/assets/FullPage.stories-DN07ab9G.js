import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-BboAvpku.js";import{P as l}from"./PluginHeader-Do3sLnye.js";import{C as p}from"./Container-w0_nVOnm.js";import{T as t}from"./Text-zWPJam2T.js";import{B as j}from"./BUIProvider-DWqxfoNj.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CsJ4-CBU.js";import"./utils-RjN6cOlV.js";import"./useObjectRef-BBnfzFd-.js";import"./useCollection-DOTSVmf0.js";import"./useFocusRing-BIuw5o9K.js";import"./openLink-TmJYTFGY.js";import"./Hidden-B9xv55fQ.js";import"./keyboard-BM3A22Pr.js";import"./getMetaValue-Dkox27la.js";import"./FocusScope-DLqV_vIF.js";import"./useEvent-SPsT6SeD.js";import"./I18nProvider-XE_7i8YB.js";import"./usePress-DjSnnouJ.js";import"./textSelection-CDb6_zJX.js";import"./useControlledState-DOt2_KtG.js";import"./Link-Ntd6Dl_L.js";import"./useLink-YtNbdIv8.js";import"./useHover-Cg57FJ61.js";import"./useLocalizedStringFormatter-DAXqnvE_.js";import"./Button-lIgsiol8.js";import"./Label-CSCfT4hg.js";import"./useLabel-BJaNI2Tj.js";import"./useLabels-C3K2MhXi.js";import"./number-2cz8Gb4T.js";import"./useButton-Cy5D_Qbf.js";import"./Menu-Cwm5Djea.js";import"./Autocomplete-BCDxmfrb.js";import"./useLoadMoreSentinel-BTIDvwXh.js";import"./Input-AtSeLTwI.js";import"./ListBox-sDiOukpB.js";import"./SelectionIndicator-UkpCWI-H.js";import"./Text-sLtLFVg2.js";import"./useListState-Mwbej2Ks.js";import"./Dialog-B9iODim2.js";import"./Heading-C6khwK_V.js";import"./useOverlayTriggerState-Bs6TYJ4q.js";import"./VisuallyHidden-myxmTh9b.js";import"./animation-8A7n9uPm.js";import"./SearchField-vONH4wm1.js";import"./FieldError-BP_cnqYJ.js";import"./Form-D3ZC0YgV.js";import"./useFormValidation-CpFVQ1y7.js";import"./useTextField-BJifqkQ_.js";import"./useField-CNx3ldnW.js";import"./useFormReset-D33UvyuP.js";import"./Virtualizer-C3G35lSd.js";import"./useFilter-DbXnACEx.js";import"./getNodeText-C3REftT6.js";import"./Link-LEZc-_KA.js";import"./useResolvedHref-ChAYmSfX.js";import"./Tooltip-B92S_96o.js";import"./VisuallyHidden-Cu2HEC9D.js";import"./Tabs-BqYh0Jup.js";import"./useHasTabbableChild-GElPIT_v.js";import"./BUIRoutingProvider-CNr62xTS.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
