import{j as t,m as d,I as u,b as h,T as g}from"./iframe-COb0l9Ot.js";import{r as x}from"./plugin-BIpkjt-U.js";import{S as m,u as n,a as S}from"./useSearchModal-BtngPYod.js";import{B as c}from"./Button-2GtkzPEz.js";import{a as f,b as M,c as j}from"./DialogTitle-B1Fp7DaC.js";import{B as C}from"./Box-DdeU9hBZ.js";import{S as r}from"./Grid-YEqTPm11.js";import{S as y}from"./SearchType-BIyroBOu.js";import{L as I}from"./List-C_SD4FZR.js";import{H as R}from"./DefaultResultListItem-CqYI6vWV.js";import{s as B,M as D}from"./api-B05H-Oij.js";import{S as T}from"./SearchContext-ChFceuBh.js";import{w as k}from"./appWrappers-CUP1_xOq.js";import{SearchBar as v}from"./SearchBar-BbyHuYwQ.js";import{a as b}from"./SearchResult-DJswzXoU.js";import"./preload-helper-D9Z9MdNV.js";import"./index-DEw7olbh.js";import"./Plugin-d8SAvW_D.js";import"./componentData-BMcw6RgA.js";import"./useAnalytics-BEClZYF1.js";import"./useApp-DOIE3BzV.js";import"./useRouteRef-B3C5BO0J.js";import"./index-C2rNmFdC.js";import"./ArrowForward-BIQnZ3Mi.js";import"./translation-eOtXtDVv.js";import"./Page-DyUMVze1.js";import"./useMediaQuery-C-1-jz19.js";import"./Divider-DBtusLcX.js";import"./ArrowBackIos-CAMhoxR7.js";import"./ArrowForwardIos-D3Bre3go.js";import"./translation-BUhTKYoK.js";import"./Modal-Da3_mpt5.js";import"./Portal-DhkyDrOm.js";import"./Backdrop-DvB5sMhK.js";import"./styled-COzJBZos.js";import"./ExpandMore-DzIoUaMP.js";import"./useAsync-Ove48rSA.js";import"./useMountedState-BCYouEnX.js";import"./AccordionDetails-xHtvINQ6.js";import"./index-DnL3XN75.js";import"./Collapse-DKLG8K48.js";import"./ListItem-BXV5PRVp.js";import"./ListContext-C2fYDrJh.js";import"./ListItemIcon-CYx9DnQ_.js";import"./ListItemText-Cpgtr8oy.js";import"./Tabs-iaKi2IH9.js";import"./KeyboardArrowRight-B6MsA7MU.js";import"./FormLabel-BjNSCMWe.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Cch3sisq.js";import"./InputLabel-DyvbRCEM.js";import"./Select-ByLRgTp3.js";import"./Popover-aodZVFnE.js";import"./MenuItem-UI-6mgld.js";import"./Checkbox-BxyG6ABj.js";import"./SwitchBase-RRrgaKwm.js";import"./Chip-Bb1lEx5J.js";import"./Link-Ct1evR27.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-GPFeSMKQ.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-CuW9a6IL.js";import"./useDebounce-RIXVfp_N.js";import"./InputAdornment-rp4p5Hf_.js";import"./TextField-Bw26PUml.js";import"./useElementFilter-mCl7Q9CS.js";import"./EmptyState-BTwV_6n3.js";import"./Progress-CGri_y1v.js";import"./LinearProgress-CzhWWhfE.js";import"./ResponseErrorPanel-8F96T6CY.js";import"./ErrorPanel-BXUGmJvH.js";import"./WarningPanel-CNUUwcSO.js";import"./MarkdownContent-DWCHMYxR.js";import"./CodeSnippet-DUq6zHFn.js";import"./CopyTextButton-L7Y3IiwS.js";import"./useCopyToClipboard-Bc2Muk56.js";import"./Tooltip-DiHf9MQ-.js";import"./Popper-Jg-KIdHc.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
