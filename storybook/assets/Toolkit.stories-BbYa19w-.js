import{j as o}from"./iframe-Bqhsa6Sh.js";import{c as e}from"./plugin-BBZXZmo4.js";import{S as l}from"./Grid-B6o2V4N5.js";import{C as m}from"./ComponentAccordion-Da6XXl3v.js";import{w as a}from"./appWrappers-DpSGCgYr.js";import{T as i}from"./TemplateBackstageLogoIcon-_8YFuG67.js";import{I as s}from"./InfoCard-DqQrAMvM.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-ChbcFySR.js";import"./componentData-BjQGtouP.js";import"./useAnalytics-V0sqNxHK.js";import"./useApp-DjjYoyBR.js";import"./useRouteRef-D2qGziGj.js";import"./index-C3od-xDV.js";import"./DialogTitle-CWvQ0e48.js";import"./Modal-Bj_JGdVD.js";import"./Portal-C0qyniir.js";import"./Backdrop-jgSEnQhj.js";import"./Button-BIWqIjhL.js";import"./useObservable-CtpiA3_D.js";import"./useIsomorphicLayoutEffect-BBofhakA.js";import"./ExpandMore-DtBTikql.js";import"./AccordionDetails-TLAxJNrY.js";import"./index-DnL3XN75.js";import"./Collapse-BmcxTB9C.js";import"./useAsync-CZ1-XOrU.js";import"./useMountedState-By8QTQnS.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-eJLTlWrs.js";import"./ErrorBoundary-qLv6qWws.js";import"./ErrorPanel-DjMQdfdJ.js";import"./WarningPanel-ChwZGoqa.js";import"./MarkdownContent-NPwWt_6a.js";import"./CodeSnippet-668TY6_y.js";import"./Box-7oeyrs_b.js";import"./styled-PHRrol5o.js";import"./CopyTextButton-BbR5f8cw.js";import"./useCopyToClipboard-Cacc49O7.js";import"./Tooltip-BcEgbTA-.js";import"./Popper-CVY8x9L-.js";import"./List-DhlESJBF.js";import"./ListContext-42q0jwAr.js";import"./ListItem-BUcGiLuR.js";import"./ListItemText-CHn-6MvY.js";import"./LinkButton-xQ2OFSZK.js";import"./Link-BYO-u9Rv.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-YTE5ohdi.js";import"./Divider-dXncAHZ6.js";import"./CardActions-CaoKmzIe.js";import"./BottomLink-Cq7vEnTL.js";import"./ArrowForward-o-fAnTPb.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
