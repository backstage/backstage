import{j as t,S as d,a0 as u,$ as h}from"./iframe-K1-r__6v.js";import{r as g}from"./plugin-BO092yBs.js";import{S as m,u as n,a as x}from"./useSearchModal-BQ48IwjW.js";import{B as c}from"./Button-4fxwjKev.js";import{D as S,a as f,b as M}from"./DialogTitle-Dt2r5HBG.js";import{B as j}from"./Box-B4QFyYd3.js";import{S as r}from"./Grid-ChuVeJzk.js";import{S as C}from"./SearchType-CrXaOBKV.js";import{L as y}from"./List-CB2UH9Sb.js";import{H as I}from"./DefaultResultListItem-jzvNNrMR.js";import{w as R}from"./appWrappers-BzzSDVYI.js";import{m as B}from"./makeStyles-cstAPlYX.js";import{s as D,M as k}from"./api-BrkUwmjx.js";import{S as v}from"./SearchContext-mmdflOD5.js";import{SearchBar as T}from"./SearchBar-l3Iz5-EW.js";import{S as b}from"./SearchResult-Dtm7raJF.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Citx8JF_.js";import"./Plugin-nF1VE1Xg.js";import"./componentData-BZ_GpIAl.js";import"./useAnalytics-BPbkB55A.js";import"./useApp-qTVc4QMB.js";import"./useRouteRef-C40w7bUW.js";import"./ArrowForward-BT_7OSP3.js";import"./translation-EJ3ipaKw.js";import"./Page-DpqqThCU.js";import"./useMediaQuery-wP2hHyDu.js";import"./Divider-DUGyrTwD.js";import"./ArrowBackIos-Bp7vOVtW.js";import"./ArrowForwardIos-DV3k63um.js";import"./translation-B5-6kEvt.js";import"./Modal-B2FsjUJx.js";import"./Portal-sMTljpp0.js";import"./Backdrop-C3chVeSM.js";import"./styled-Dvtyklio.js";import"./ExpandMore-GHPOgA4J.js";import"./useAsync-BgYtvaG8.js";import"./useMountedState-BKHhStKI.js";import"./AccordionDetails-B5q_f95I.js";import"./index-B9sM2jn7.js";import"./Collapse-COvLNAfh.js";import"./ListItem-B_ZN_8ak.js";import"./ListContext-DOXF3fgH.js";import"./ListItemIcon-CfdEr_Nh.js";import"./ListItemText-Be1a_sGd.js";import"./Tabs-BI8y5_TE.js";import"./KeyboardArrowRight-G5vfZSze.js";import"./FormLabel-Dei5kuYK.js";import"./formControlState-D8EmHlrI.js";import"./InputLabel-D9SXL_Q1.js";import"./Select-Dlh90hDr.js";import"./Popover-BubBbulz.js";import"./MenuItem-jsbiukEC.js";import"./Checkbox-BRWq3VmK.js";import"./SwitchBase-OAjnV3Q9.js";import"./Chip-C91p442v.js";import"./Link-B5LuFRSc.js";import"./index-DpBtBlP-.js";import"./lodash-DrAHxKI9.js";import"./WebStorage-CXRAncSk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CE15zcTV.js";import"./useIsomorphicLayoutEffect-DUO6YzsE.js";import"./BUIProvider-BXUq6XUb.js";import"./openLink-Buy5e0wx.js";import"./Search-BRUAKREc.js";import"./useDebounce-rx4pewK1.js";import"./InputAdornment-pH4qK6mm.js";import"./TextField-DWE06n4d.js";import"./useElementFilter-szgBOFtQ.js";import"./EmptyState-BqblXjb_.js";import"./Progress-Cs3NuwtW.js";import"./LinearProgress-Br1ggTU_.js";import"./ResponseErrorPanel-B_dbLtq3.js";import"./ErrorPanel-TINjs-TZ.js";import"./WarningPanel-CRkeNd9c.js";import"./MarkdownContent-loM_RY04.js";import"./CodeSnippet-VWXx1uDM.js";import"./CopyTextButton-F41xXW8n.js";import"./useCopyToClipboard-BZjwlB7d.js";import"./Tooltip-DwW2_HQ0.js";import"./Popper-nGRjgLcs.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...s.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{s as CustomModal,i as Default,co as __namedExportsOrder,no as default};
