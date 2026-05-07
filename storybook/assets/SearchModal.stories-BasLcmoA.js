import{j as t,W as d,a3 as u,a2 as h}from"./iframe-Cm1o1Xbd.js";import{r as g}from"./plugin-C6CWp-rL.js";import{S as l,u as n,a as x}from"./useSearchModal-BfEw3oOF.js";import{B as c}from"./Button-CYitkDqY.js";import{D as S,a as f,b as M}from"./DialogTitle-CIacgU6x.js";import{B as j}from"./Box-H3EEpFmb.js";import{S as r}from"./Grid-Bci0B9zS.js";import{S as C}from"./SearchType-APVpvBu4.js";import{L as y}from"./List-DSQEbQUU.js";import{H as I}from"./DefaultResultListItem-DQ7Anwru.js";import{w as R}from"./appWrappers-BunfmKJx.js";import{m as B}from"./makeStyles-CgDsK_IC.js";import{s as D,M as k}from"./api-Cn7FDnlb.js";import{S as v}from"./SearchContext-DMcG2vUe.js";import{SearchBar as T}from"./SearchBar--2hKETRT.js";import{S as b}from"./SearchResult-D4Ok7I7y.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BQdDpX6M.js";import"./Plugin-BW5DJCkR.js";import"./componentData-ClFrh1_L.js";import"./useAnalytics-BEwOoq4N.js";import"./useApp-Pblw4TFB.js";import"./useRouteRef-BzSmmp13.js";import"./ArrowForward-DaBkxjS7.js";import"./translation-D5IV_rKl.js";import"./Page-DbJEwEi2.js";import"./useMediaQuery-BDIGYRM6.js";import"./Divider-D_U4zSui.js";import"./ArrowBackIos-RWwDXvat.js";import"./ArrowForwardIos-CWQk2RGG.js";import"./translation-CSs5G3Vr.js";import"./Modal-DcI2lTu0.js";import"./Portal-BCJJ0GKL.js";import"./Backdrop-BZErciJr.js";import"./styled-CDaxGVWn.js";import"./ExpandMore-FnfrAYVB.js";import"./useAsync-GF3_H2EU.js";import"./useMountedState-Blvo2f43.js";import"./AccordionDetails-BAp-U8Z2.js";import"./index-B9sM2jn7.js";import"./Collapse-BYA1yqoX.js";import"./ListItem-B3id05WU.js";import"./ListContext-Bcv2AtVr.js";import"./ListItemIcon-BnX2k0gC.js";import"./ListItemText-BOtbiPEf.js";import"./Tabs-FGXad4iz.js";import"./KeyboardArrowRight-qNpqY35K.js";import"./FormLabel-DQFy2G3E.js";import"./formControlState-Dz--SRMG.js";import"./InputLabel-bgiVXqAi.js";import"./Select-CLzuZyA4.js";import"./Popover-CsHm-zYv.js";import"./MenuItem-uZ8io8GD.js";import"./Checkbox-cCB3J55L.js";import"./SwitchBase-BjaK1EFh.js";import"./Chip-C57kDIBJ.js";import"./Link-BujjMqyX.js";import"./index-Dmtd4Pzp.js";import"./lodash-DTaZxSKz.js";import"./WebStorage-MrEjFDxR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CI_yBCl2.js";import"./useIsomorphicLayoutEffect-BlGD8AVz.js";import"./BUIProvider-BvKJ30ug.js";import"./openLink-D5lxhsMC.js";import"./useResolvedHref-DkoMOC3w.js";import"./Search-BuAE8azJ.js";import"./useDebounce-R_i0X6nD.js";import"./InputAdornment-COs74mYm.js";import"./TextField-DbGdwUMS.js";import"./useElementFilter-BdT6mkQa.js";import"./EmptyState-Bp4ZXssO.js";import"./Progress-O1qgyKds.js";import"./LinearProgress-Cf80kNZS.js";import"./ResponseErrorPanel-CcZVdkJl.js";import"./ErrorPanel-BiGslUfc.js";import"./WarningPanel-Dr3kzVSN.js";import"./MarkdownContent-D5BAVgm9.js";import"./CodeSnippet-JBqL3FbK.js";import"./CopyTextButton-DS8F_NJm.js";import"./useCopyToClipboard-CxDIm2O1.js";import"./Tooltip-CCT5u6cY.js";import"./Popper-FZKJk7TA.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
