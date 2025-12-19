import{j as o}from"./iframe-DVMaQ9oH.js";import{c as e}from"./plugin-i9GPhXRv.js";import{S as l}from"./Grid-BnNe0SDT.js";import{C as m}from"./ComponentAccordion-C8Uz7H6l.js";import{w as a}from"./appWrappers-DDl-WsMM.js";import{T as i}from"./TemplateBackstageLogoIcon-NNOaLdzY.js";import{I as s}from"./InfoCard-CgW9jWlR.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CyrjOCVF.js";import"./componentData-CuhNelpK.js";import"./useAnalytics-D_e6aR87.js";import"./useApp-CbdAPFaX.js";import"./useRouteRef-DTds5z5u.js";import"./index-CrsCYslC.js";import"./DialogTitle-BLuVPIsL.js";import"./Modal-CJ1fn4qg.js";import"./Portal-B9YgpH-D.js";import"./Backdrop-0IChyXw2.js";import"./Button-DnJe8T7L.js";import"./useObservable-CxLKaDzP.js";import"./useIsomorphicLayoutEffect-Cs1tA7z9.js";import"./ExpandMore-BkRt0N0x.js";import"./AccordionDetails-DDgGuMuh.js";import"./index-B9sM2jn7.js";import"./Collapse-DjiqELor.js";import"./useAsync-C7ceDp4n.js";import"./useMountedState-CB6VIth1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DALz_wlP.js";import"./ErrorBoundary-COMXETD1.js";import"./ErrorPanel-DOpGEyf2.js";import"./WarningPanel-C40EW-7C.js";import"./MarkdownContent-DWrveYca.js";import"./CodeSnippet-BT17ih3z.js";import"./Box-CFSsj6ua.js";import"./styled-BBv6xD1v.js";import"./CopyTextButton-DhPBCIRt.js";import"./useCopyToClipboard-C3pKoU0U.js";import"./Tooltip-DuScsKtZ.js";import"./Popper-D9ki8Cw9.js";import"./List-Dti-y3i6.js";import"./ListContext-BKfPcfO0.js";import"./ListItem-D0hmS8se.js";import"./ListItemText-1_kgrXU9.js";import"./LinkButton-CLXyglo-.js";import"./Link-INNWSaUp.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-anUaTI8l.js";import"./Divider-DFSugnoU.js";import"./CardActions-N5CiU28L.js";import"./BottomLink-CspCmDGQ.js";import"./ArrowForward-D-fiTE2a.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
