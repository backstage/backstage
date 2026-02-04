import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-D7hFsAHh.js";import{s as g,H as u}from"./plugin-BnCxuXN9.js";import{c as h}from"./api-A81Dnrs1.js";import{c as f}from"./catalogApiMock-DFweSnrV.js";import{s as x}from"./api-Du5KuwVt.js";import{S as y}from"./SearchContext-w4Vv18Zz.js";import{P as S}from"./Page-D0DmJCr2.js";import{S as r}from"./Grid-BBTPNutj.js";import{b as k,a as j,c as C}from"./plugin-BJCQ9dlH.js";import{T as P}from"./TemplateBackstageLogo-jXT1cBw5.js";import{T as I}from"./TemplateBackstageLogoIcon-n5h_0Wwr.js";import{e as T}from"./routes-B3qFWxft.js";import{w as v}from"./appWrappers-BPgQm-7I.js";import{s as G}from"./StarredEntitiesApi-BsHnNY4O.js";import{M as A}from"./MockStarredEntitiesApi-C9495UeI.js";import{I as B}from"./InfoCard-DQx2F9Xz.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cl21dMT5.js";import"./Plugin-BOlTNLJ_.js";import"./componentData-B0-3b838.js";import"./useAnalytics-DEh4mfg6.js";import"./useApp-DH_b7x7P.js";import"./useRouteRef-BuKO7_g7.js";import"./index-CMWiNJrn.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-BELltm9_.js";import"./useMountedState-jyZ6jmpg.js";import"./DialogTitle-I9jy4wXP.js";import"./Modal-DMtGtm-r.js";import"./Portal-8ZiP_Sqy.js";import"./Backdrop-DxPYSkiX.js";import"./Button-Qm72mdor.js";import"./useObservable-CtiHHxxM.js";import"./useIsomorphicLayoutEffect-CtVE3GbE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CuI1c31y.js";import"./ErrorBoundary-B1MdgVzH.js";import"./ErrorPanel-REZtkXZm.js";import"./WarningPanel-BXBOJrST.js";import"./ExpandMore-e5K7_2D4.js";import"./AccordionDetails-Bs_9tEgl.js";import"./index-B9sM2jn7.js";import"./Collapse-CX1fKFyZ.js";import"./MarkdownContent-lDWK0lAQ.js";import"./CodeSnippet-DfGrFjGG.js";import"./Box-D-wD6_7y.js";import"./styled-CbYuIyxW.js";import"./CopyTextButton-NjimjsMr.js";import"./useCopyToClipboard-CaZKc_Tm.js";import"./Tooltip-5tHvVIiB.js";import"./Popper-DQ1szM6i.js";import"./List-CIMPRI7k.js";import"./ListContext-D0CqRlfT.js";import"./ListItem-CLTebMeN.js";import"./ListItemText-Ben4oQC7.js";import"./LinkButton-tqpeZKNg.js";import"./Link-JoAHle2P.js";import"./CardHeader-Bq5V7SOz.js";import"./Divider-DMcnu_lF.js";import"./CardActions-wVEVY7hR.js";import"./BottomLink-BbJ3fpw-.js";import"./ArrowForward-B95Ii3a7.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Ft as default};
