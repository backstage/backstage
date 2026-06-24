import{bR as t,u as d,l as u,a5 as h}from"./iframe-DhttR-Z-.js";import{r as g}from"./plugin-CzDNh-DL.js";import{S as m,u as n,b as x}from"./useSearchModal-D_U1iBBV.js";import{B as c}from"./Button-mAQR2kmf.js";import{c as S,b as f,a as M}from"./DialogTitle-hZ94N0vG.js";import{B as j}from"./Box-CUxFOM_T.js";import{S as r}from"./Grid-VkbE96t3.js";import{S as C}from"./SearchType-B55xH9CM.js";import{L as y}from"./List-DzoxYXEY.js";import{H as R}from"./DefaultResultListItem-BX6WlNOc.js";import{O as I}from"./appWrappers-W5GcWo01.js";import{m as B}from"./makeStyles-C_GO-7Nl.js";import{s as D,M as b}from"./api-DBjJ-jAU.js";import{S as k}from"./SearchContext-sRsuNos3.js";import{SearchBar as v}from"./SearchBar-Dk5RwnOZ.js";import{S as T}from"./SearchResult-DmgU4Jbe.js";import"./preload-helper-PPVm8Dsz.js";import"./index-jjOY_5Uc.js";import"./Plugin-4vUB_1H0.js";import"./componentData-BvjWmSwQ.js";import"./useAnalytics-Cg4YSIs1.js";import"./useApp-CHw-3fg9.js";import"./useRouteRef-DBe8dPTu.js";import"./ArrowForward-Huc5aJF9.js";import"./translation-BaRJInK2.js";import"./Page-BiQVpj3Q.js";import"./useMediaQuery-By5vZ5F1.js";import"./Divider-Dn59IuqE.js";import"./ArrowBackIos-BHYMggbz.js";import"./ArrowForwardIos-_DfWFQvC.js";import"./translation-D1F5ey81.js";import"./Modal-LyNkSPwz.js";import"./Portal-CqcvHw1l.js";import"./Backdrop-NRIxl84c.js";import"./styled-jJXBC4kr.js";import"./ExpandMore-BIuXHLqD.js";import"./useAsync-ki1MR06s.js";import"./useMountedState-CE-seWbI.js";import"./AccordionDetails-DRqafEwz.js";import"./index-B9sM2jn7.js";import"./Collapse-CQ74Gc0d.js";import"./ListItem-C_3NeckJ.js";import"./ListContext-DPsuXuco.js";import"./ListItemIcon-VxUDE6Xl.js";import"./ListItemText-Cn8xzOI9.js";import"./Tabs-CR_O07Sl.js";import"./KeyboardArrowRight-itzlJ3n-.js";import"./FormLabel-ChnMUfps.js";import"./formControlState-B-rxgywu.js";import"./InputLabel-BQ67Msv6.js";import"./Select-CZso9XJc.js";import"./Popover-DHFEClMd.js";import"./MenuItem-ZprNJSVL.js";import"./Checkbox-eY4ZgLwK.js";import"./SwitchBase-BVA4SzE0.js";import"./Chip-D7Y_Twro.js";import"./Link-CmpVD7EF.js";import"./index-B5_svkds.js";import"./lodash-B8DiURsi.js";import"./WebStorage-DjcMxtyl.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-7t-5UrlQ.js";import"./useIsomorphicLayoutEffect-DHDV1_5M.js";import"./BUIProvider-CUKyC6Rl.js";import"./openLink-DDEWcvNy.js";import"./useResolvedHref-CHSc8dmW.js";import"./Search-BHr-aA29.js";import"./useDebounce-8KPZgNq-.js";import"./InputAdornment-Cs06mEcT.js";import"./TextField-xRVUmEfW.js";import"./useElementFilter-8GGhuKVE.js";import"./EmptyState-IpQpfSsB.js";import"./Progress-gQWo-M1M.js";import"./LinearProgress-B3WYKoOp.js";import"./ResponseErrorPanel-chHdV_ZF.js";import"./ErrorPanel-D_q8qYhi.js";import"./WarningPanel-DgRNnxkJ.js";import"./MarkdownContent-CmlvBWEr.js";import"./CodeSnippet-ClFaEFmB.js";import"./CopyTextButton-BwcNHDZX.js";import"./useCopyToClipboard-CWfwN7Xp.js";import"./Tooltip-CLkcFFIX.js";import"./Popper-CM66lfCc.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
