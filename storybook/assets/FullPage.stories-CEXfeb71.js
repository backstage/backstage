import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-D5t0zV2Z.js";import{P as l}from"./PluginHeader-int7sGrM.js";import{C as p}from"./Container-EPqctBia.js";import{T as t}from"./Text-DICziNDH.js";import{B as j}from"./BUIProvider-1V_oyFR4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DvEtjejY.js";import"./utils-C39--9xx.js";import"./useObjectRef-kGsiECgS.js";import"./useCollection-D9Ya-DMs.js";import"./useFocusRing-vtWZMyzl.js";import"./openLink-DJ_oJLh5.js";import"./Hidden-Dsa08sWj.js";import"./keyboard-vsvxufhh.js";import"./getMetaValue-lPtVOvv4.js";import"./FocusScope-B3AKJWwl.js";import"./useEvent-Ky4nwph9.js";import"./I18nProvider-CnCaeKRg.js";import"./usePress-Dmt7pnzP.js";import"./textSelection-FMDS3d8l.js";import"./useControlledState-CWsOmoBN.js";import"./Link-C_DZVKmp.js";import"./useLink-CvpxL4Ut.js";import"./useHover-CMgWw-jG.js";import"./useLocalizedStringFormatter-Dq7SKV2-.js";import"./Button-DnnkrgV8.js";import"./Label-DaItaSZn.js";import"./useLabel-32i4SIb0.js";import"./useLabels-D8GfqFut.js";import"./number-DtQkEWx4.js";import"./useButton-DdkvoT6L.js";import"./Menu-DYKX3y-n.js";import"./Autocomplete-C2BxSGXK.js";import"./useLoadMoreSentinel-D0yXM04e.js";import"./Input-B8KQxdZr.js";import"./ListBox-DuO79u2v.js";import"./SelectionIndicator-CvD_mVQX.js";import"./Text--erJL1eo.js";import"./useListState-CSvV5XS2.js";import"./Dialog-WOQVM2qV.js";import"./Heading-WJeSrVAJ.js";import"./useOverlayTriggerState-D9dRXQwO.js";import"./VisuallyHidden-CfB2zf9t.js";import"./animation-COaRnszU.js";import"./SearchField-DGh4rKVQ.js";import"./FieldError-BufNcm74.js";import"./Form-RnyeY1Wv.js";import"./useFormValidation-DF0-wOxW.js";import"./useTextField-BqFVkvRL.js";import"./useField-B9NwoH1a.js";import"./useFormReset-B281acCK.js";import"./Virtualizer-CTTIRba9.js";import"./useFilter-YxJTrxQ1.js";import"./getNodeText-IxDMTKQ7.js";import"./Link-Cxebd6bx.js";import"./useResolvedHref-BwjjIWjA.js";import"./Tooltip-BqXTcCpb.js";import"./VisuallyHidden-S3fbQHLQ.js";import"./Tabs-B6Siqego.js";import"./useHasTabbableChild-72UTjfLD.js";import"./BUIRoutingProvider-Bi_Kr0PI.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
