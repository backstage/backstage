import{j as t,m as d,I as u,b as h,T as g}from"./iframe-PR9K1gR4.js";import{r as x}from"./plugin-CFnafnlx.js";import{S as m,u as n,a as S}from"./useSearchModal-ChRc86IJ.js";import{B as c}from"./Button-DAulvpLo.js";import{a as f,b as M,c as j}from"./DialogTitle-B59kuhfC.js";import{B as C}from"./Box-DE3El2Us.js";import{S as r}from"./Grid-BDCj0xnW.js";import{S as y}from"./SearchType-DITugPls.js";import{L as I}from"./List-9O5jesKH.js";import{H as R}from"./DefaultResultListItem-CbfbLlig.js";import{s as B,M as D}from"./api-D5cPBjSE.js";import{S as T}from"./SearchContext-DmbFGlyz.js";import{w as k}from"./appWrappers-DEOTEiR9.js";import{SearchBar as v}from"./SearchBar-Bkb8nvMP.js";import{a as b}from"./SearchResult-C7G_gEI5.js";import"./preload-helper-D9Z9MdNV.js";import"./index-Cmq8aGIJ.js";import"./Plugin-DNmMI31j.js";import"./componentData-o86LZs6r.js";import"./useAnalytics-D2YlE8CY.js";import"./useApp-BW5Yca7D.js";import"./useRouteRef-B521NRec.js";import"./index-qP2Hr3Qu.js";import"./ArrowForward-B-qxFdBl.js";import"./translation-DozaofXf.js";import"./Page-B_shoIxi.js";import"./useMediaQuery-Bdoqc4QJ.js";import"./Divider-C49XG7LX.js";import"./ArrowBackIos-BeXKaB7o.js";import"./ArrowForwardIos-DwEU7cDg.js";import"./translation-DRTxjgjv.js";import"./Modal-DgU04yZ2.js";import"./Portal-CHANQNTr.js";import"./Backdrop-B3ZiF5N6.js";import"./styled-BWfK9xAq.js";import"./ExpandMore-C65eZJGL.js";import"./useAsync-CdCMGCNf.js";import"./useMountedState-9lLipg6w.js";import"./AccordionDetails-C_jBxEzP.js";import"./index-DnL3XN75.js";import"./Collapse-B00qmsYa.js";import"./ListItem-BSmKrE7c.js";import"./ListContext-d9I9drbR.js";import"./ListItemIcon-DPKAOxsE.js";import"./ListItemText-BDaGpWdO.js";import"./Tabs-CVWjU9ok.js";import"./KeyboardArrowRight-CKbvtTmF.js";import"./FormLabel-BNpfmOSH.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CNqdG48A.js";import"./InputLabel-B2OeJ7wX.js";import"./Select-CCKModBu.js";import"./Popover-BP65aWRb.js";import"./MenuItem-Cs-G5Cbc.js";import"./Checkbox-scMIVqBj.js";import"./SwitchBase-ChdSqEBb.js";import"./Chip-gn0_WuuN.js";import"./Link-8mF5gqTh.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-BhXF4yMN.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-BBofiqKF.js";import"./useDebounce-CWmJbI_R.js";import"./InputAdornment-CUpj5DsC.js";import"./TextField-NCGKTwtT.js";import"./useElementFilter-Cq7443pA.js";import"./EmptyState-DTISPF46.js";import"./Progress-CKjAnVha.js";import"./LinearProgress-DmDEYB5n.js";import"./ResponseErrorPanel-Dng7zLao.js";import"./ErrorPanel-wKrI7pp5.js";import"./WarningPanel-BdWxPo3h.js";import"./MarkdownContent-CPx5kcko.js";import"./CodeSnippet-BcyQuG45.js";import"./CopyTextButton-EKDV7SOv.js";import"./useCopyToClipboard-Dv8Ke7sP.js";import"./Tooltip-NKLLE1oV.js";import"./Popper-C2P8lryL.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const ao=["Default","CustomModal"];export{i as CustomModal,s as Default,ao as __namedExportsOrder,io as default};
